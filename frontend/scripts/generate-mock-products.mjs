#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function parseArgs(argv) {
  const args = {
    outDir: 'frontend/src/mock-data',
    max: 0,
    fetchTitles: false,
    fetchDetails: false,
    concurrency: 6,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--out' || a === '--outDir') {
      args.outDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (a === '--max') {
      args.max = Number.parseInt(argv[i + 1] ?? '0', 10) || 0;
      i += 1;
      continue;
    }
    if (a === '--fetch-titles' || a === '--titles') {
      args.fetchTitles = true;
      continue;
    }
    if (a === '--details' || a === '--fetch-details' || a === '--enrich') {
      args.fetchDetails = true;
      continue;
    }
    if (a === '--concurrency') {
      args.concurrency = Number.parseInt(argv[i + 1] ?? '6', 10) || 6;
      i += 1;
      continue;
    }
  }

  return args;
}

function decodeXmlEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function extractLocs(xmlText) {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let match;
  while ((match = re.exec(xmlText)) !== null) {
    const loc = decodeXmlEntities(match[1].trim());
    if (loc) locs.push(loc);
  }
  return locs;
}

function extractUrlEntries(xmlText) {
  const entries = [];
  const urlBlockRe = /<url>([\s\S]*?)<\/url>/gi;
  let block;
  while ((block = urlBlockRe.exec(xmlText)) !== null) {
    const chunk = block[1];
    const locMatch = chunk.match(/<loc>([^<]+)<\/loc>/i);
    if (!locMatch?.[1]) continue;
    const loc = decodeXmlEntities(locMatch[1].trim());

    const images = [];
    const imgRe = /<image:loc>([^<]+)<\/image:loc>/gi;
    let img;
    while ((img = imgRe.exec(chunk)) !== null) {
      const imgLoc = decodeXmlEntities(img[1].trim());
      if (imgLoc) images.push(imgLoc);
    }

    entries.push({ loc, images });
  }
  return entries;
}

function looksLikeSitemapIndex(xmlText) {
  return /<sitemapindex\b/i.test(xmlText);
}

function normalizeWhitespace(s) {
  return s.replace(/\s+/g, ' ').trim();
}

function titleFromUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] ?? '';
    const raw = last
      .replace(/\.html?$/i, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\d+\b/g, '')
      .trim();
    if (!raw) return null;

    // Simple title-case-ish without being too clever.
    const titled = raw
      .split(' ')
      .filter(Boolean)
      .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
      .join(' ');

    return normalizeWhitespace(titled);
  } catch {
    return null;
  }
}

async function fetchText(url, { userAgent = DEFAULT_UA } = {}) {
  const res = await fetch(url, {
    headers: {
      'user-agent': userAgent,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    redirect: 'follow',
  });

  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} for ${url}`);
  }

  return await res.text();
}

function tryParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const raw = match[1]?.trim();
    if (!raw) continue;
    const parsed = tryParseJson(raw);
    if (parsed) blocks.push(parsed);
  }
  return blocks;
}

function flattenJsonLdNodes(blocks) {
  const nodes = [];
  const push = (x) => {
    if (!x) return;
    if (Array.isArray(x)) {
      x.forEach(push);
      return;
    }
    if (typeof x === 'object') nodes.push(x);
  };

  for (const b of blocks) {
    if (b && typeof b === 'object' && '@graph' in b) push(b['@graph']);
    else push(b);
  }
  return nodes;
}

function isProductNode(node) {
  const t = node?.['@type'];
  if (!t) return false;
  if (Array.isArray(t)) return t.includes('Product');
  return t === 'Product';
}

function getFirstNonEmpty(...values) {
  for (const v of values) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

function coerceImages(imageField) {
  if (!imageField) return [];
  if (typeof imageField === 'string') return [imageField];
  if (Array.isArray(imageField)) return imageField.filter((x) => typeof x === 'string');
  return [];
}

function extractMetaContent(html, attrName, attrValue) {
  const re = new RegExp(
    `<meta\\s+[^>]*${attrName}=["']${attrValue}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    'i'
  );
  const m = html.match(re);
  return m?.[1] ? normalizeWhitespace(decodeXmlEntities(m[1])) : null;
}

function parsePriceNumber(value) {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  const n = Number.parseFloat(s.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function extractProductDetailsFromHtml(html) {
  const blocks = extractJsonLdBlocks(html);
  const nodes = flattenJsonLdNodes(blocks);

  const product = nodes.find(isProductNode) ?? null;

  // Also allow WebPage description/title as fallback
  const webPage =
    nodes.find((n) => {
      const t = n?.['@type'];
      if (Array.isArray(t)) return t.includes('WebPage');
      return t === 'WebPage';
    }) ?? null;

  const name =
    getFirstNonEmpty(product?.name, webPage?.name) ??
    extractOgTitle(html);

  const description =
    getFirstNonEmpty(product?.description, webPage?.description) ??
    extractMetaContent(html, 'property', 'og:description') ??
    extractMetaContent(html, 'name', 'description');

  const images = [
    ...coerceImages(product?.image),
    ...coerceImages(webPage?.thumbnailUrl),
    ...(extractMetaContent(html, 'property', 'og:image')
      ? [extractMetaContent(html, 'property', 'og:image')]
      : []),
  ].filter(Boolean);

  const offers = product?.offers;
  let currency = null;
  let price = null;

  const offerObj = Array.isArray(offers) ? offers[0] : offers;
  if (offerObj && typeof offerObj === 'object') {
    currency = getFirstNonEmpty(offerObj.priceCurrency) ?? currency;
    price = parsePriceNumber(offerObj.price ?? offerObj.lowPrice ?? offerObj.highPrice) ?? price;
  }

  // Meta fallbacks (some themes include these)
  currency =
    currency ??
    extractMetaContent(html, 'property', 'product:price:currency') ??
    extractMetaContent(html, 'property', 'og:price:currency');

  price =
    price ??
    parsePriceNumber(extractMetaContent(html, 'property', 'product:price:amount')) ??
    parsePriceNumber(extractMetaContent(html, 'property', 'og:price:amount'));

  return {
    name: name ? normalizeWhitespace(name) : null,
    description: description ? normalizeWhitespace(description) : null,
    images,
    imageUrl: images[0] ?? null,
    price,
    currency,
  };
}

async function fetchRobotsSitemaps(siteBaseUrl) {
  const robotsUrl = new URL('/robots.txt', siteBaseUrl).toString();
  let robotsText = '';
  try {
    robotsText = await fetchText(robotsUrl);
  } catch {
    return [];
  }

  const sitemaps = [];
  for (const line of robotsText.split(/\r?\n/)) {
    const m = line.match(/^\s*Sitemap:\s*(\S+)\s*$/i);
    if (m) sitemaps.push(m[1]);
  }

  return sitemaps;
}

async function discoverSitemapEntrypoints(siteBaseUrl) {
  const fromRobots = await fetchRobotsSitemaps(siteBaseUrl);
  if (fromRobots.length > 0) return fromRobots;

  const candidates = [
    new URL('/sitemap.xml', siteBaseUrl).toString(),
    new URL('/sitemap_index.xml', siteBaseUrl).toString(),
    new URL('/sitemap-index.xml', siteBaseUrl).toString(),
  ];

  // Best-effort: return candidates; fetch will error if missing.
  return candidates;
}

async function expandSitemaps(entryUrls) {
  const seen = new Set();
  const queue = [...entryUrls];
  const sitemapUrls = [];

  while (queue.length > 0) {
    const next = queue.shift();
    if (!next || seen.has(next)) continue;
    seen.add(next);

    let xml;
    try {
      xml = await fetchText(next);
    } catch {
      continue;
    }

    const locs = extractLocs(xml);
    if (looksLikeSitemapIndex(xml)) {
      for (const loc of locs) queue.push(loc);
    } else {
      sitemapUrls.push(next);
    }
  }

  return sitemapUrls;
}

function filterProductUrls(site, urls) {
  const host = new URL(site).host;

  const isProductUrl = (u) => {
    try {
      const url = new URL(u);
      if (url.host !== host) return false;
      const p = url.pathname;

      // Shopify
      if (p.includes('/products/')) return true;

      // Common WooCommerce
      if (p.includes('/product/')) return true;

      // Dermastore appears to use root-level slugs for products
      if (host === 'dermastore.co.za') {
        if (p === '/shop/' || p === '/shop') return false;
        if (p.startsWith('/video-consult')) return false;
        // Heuristic: allow most root-level slugs.
        return p.split('/').filter(Boolean).length === 1;
      }

      return false;
    } catch {
      return false;
    }
  };

  return urls.filter(isProductUrl);
}

async function extractProductEntriesFromSite(siteBaseUrl) {
  const entrypoints = await discoverSitemapEntrypoints(siteBaseUrl);
  const sitemapUrls = await expandSitemaps(entrypoints);

  const productSitemapUrls = sitemapUrls.filter((u) =>
    /product-sitemap\d*\.xml/i.test(u) || /sitemap_products_/i.test(u)
  );

  const targetSitemaps = productSitemapUrls.length > 0 ? productSitemapUrls : sitemapUrls;

  const allEntries = [];
  for (const sm of targetSitemaps) {
    let xml;
    try {
      xml = await fetchText(sm);
    } catch {
      continue;
    }

    // Prefer extracting <url> entries (so we can grab image:loc); fallback to loc list.
    const entries = extractUrlEntries(xml);
    if (entries.length > 0) {
      allEntries.push(...entries);
    } else {
      allEntries.push(...extractLocs(xml).map((loc) => ({ loc, images: [] })));
    }
  }

  // Dedupe while preserving order
  const seen = new Set();
  const unique = [];
  for (const e of allEntries) {
    if (!e?.loc) continue;
    if (seen.has(e.loc)) continue;
    seen.add(e.loc);
    unique.push(e);
  }

  const filteredLocs = filterProductUrls(
    siteBaseUrl,
    unique.map((e) => e.loc)
  );
  const filteredSet = new Set(filteredLocs);
  return unique.filter((e) => filteredSet.has(e.loc));
}

async function runWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let idx = 0;

  async function runner() {
    while (true) {
      const current = idx;
      idx += 1;
      if (current >= items.length) return;
      results[current] = await worker(items[current], current);
    }
  }

  const runners = Array.from({ length: Math.max(1, concurrency) }, () => runner());
  await Promise.all(runners);
  return results;
}

function extractOgTitle(html) {
  const m = html.match(/<meta\s+[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (m?.[1]) return normalizeWhitespace(m[1]);
  const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (t?.[1]) return normalizeWhitespace(t[1]);
  return null;
}

async function enrichTitles(products, { fetchTitles, concurrency }) {
  if (!fetchTitles) return products;

  const enriched = await runWithConcurrency(products, concurrency, async (p) => {
    try {
      const html = await fetchText(p.url);
      const title = extractOgTitle(html);
      if (title) return { ...p, name: title };
    } catch {
      // ignore
    }
    return p;
  });

  return enriched;
}

async function enrichDetails(products, { fetchDetails, concurrency }) {
  if (!fetchDetails) return products;

  const enriched = await runWithConcurrency(products, concurrency, async (p) => {
    try {
      const html = await fetchText(p.url);
      const details = extractProductDetailsFromHtml(html);
      return {
        ...p,
        name: details.name ?? p.name,
        description: details.description ?? null,
        imageUrl: details.imageUrl ?? p.imageUrl,
        images: details.images,
        price: details.price,
        currency: details.currency,
      };
    } catch {
      return {
        ...p,
        description: null,
        images: Array.isArray(p.images) ? p.images : [],
        price: null,
        currency: null,
      };
    }
  });

  return enriched;
}

function makeMockSku(prefix, index) {
  const n = String(index + 1).padStart(5, '0');
  return `${prefix}-${n}`;
}

function uniqPreserveOrder(values) {
  const seen = new Set();
  const out = [];
  for (const v of values) {
    if (typeof v !== 'string') continue;
    const s = v.trim();
    if (!s) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function normalizeProductRecord(p) {
  const images = uniqPreserveOrder(
    Array.isArray(p.images)
      ? p.images
      : typeof p.imageUrl === 'string' && p.imageUrl.trim()
        ? [p.imageUrl]
        : []
  );
  const imageUrl = images[0] ?? (typeof p.imageUrl === 'string' && p.imageUrl.trim() ? p.imageUrl.trim() : null);

  return {
    ...p,
    name: typeof p.name === 'string' && p.name.trim() ? p.name.trim() : null,
    description: typeof p.description === 'string' && p.description.trim() ? p.description.trim() : null,
    images,
    imageUrl,
    price: Number.isFinite(p.price) ? p.price : null,
    currency: typeof p.currency === 'string' && p.currency.trim() ? p.currency.trim() : null,
  };
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const sites = [
    { name: 'dermastore', baseUrl: 'https://dermastore.co.za', skuPrefix: 'DERMA' },
    { name: 'beautytreats', baseUrl: 'https://beautytreats.co.za', skuPrefix: 'BT' },
  ];

  const outDirAbs = path.isAbsolute(args.outDir)
    ? args.outDir
    : path.join(process.cwd(), args.outDir);

  const all = [];

  for (const site of sites) {
    const entries = await extractProductEntriesFromSite(site.baseUrl);
    const limited = args.max > 0 ? entries.slice(0, args.max) : entries;

    let products = limited.map((entry, i) => ({
      source: site.baseUrl,
      url: entry.loc,
      name: titleFromUrl(entry.loc),
      sku: makeMockSku(site.skuPrefix, i),
      imageUrl: entry.images?.[0] ?? null,
      images: Array.isArray(entry.images) ? entry.images : [],
    }));

    products = await enrichTitles(products, {
      fetchTitles: args.fetchTitles,
      concurrency: args.concurrency,
    });

    products = await enrichDetails(products, {
      fetchDetails: args.fetchDetails,
      concurrency: args.concurrency,
    });

    products = products.map(normalizeProductRecord);

    const payload = {
      source: site.baseUrl,
      generatedAt: new Date().toISOString(),
      count: products.length,
      products,
    };

    const outFile = path.join(outDirAbs, `${site.name}-products.json`);
    await writeJson(outFile, payload);
    all.push(...products);

    // eslint-disable-next-line no-console
    console.log(`${site.name}: wrote ${products.length} products -> ${outFile}`);
  }

  const combined = {
    generatedAt: new Date().toISOString(),
    count: all.length,
    products: all,
  };

  const combinedFile = path.join(outDirAbs, 'all-products.json');
  await writeJson(combinedFile, combined);
  // eslint-disable-next-line no-console
  console.log(`combined: wrote ${all.length} products -> ${combinedFile}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
