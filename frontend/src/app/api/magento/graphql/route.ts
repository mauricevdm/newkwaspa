import { NextResponse, type NextRequest } from 'next/server';

const DEFAULT_TIMEOUT_MS = 15_000;

function getUpstreamGraphqlUrl(): string {
  return (
    process.env.MAGENTO_UPSTREAM_GRAPHQL_URL ||
    process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL ||
    ''
  );
}

function getDefaultStoreCode(): string | undefined {
  return process.env.MAGENTO_STORE_CODE || process.env.NEXT_PUBLIC_MAGENTO_STORE_CODE;
}

export async function POST(request: NextRequest) {
  const upstream = getUpstreamGraphqlUrl();
  if (!upstream) {
    return NextResponse.json(
      { error: 'Missing MAGENTO_UPSTREAM_GRAPHQL_URL (or NEXT_PUBLIC_MAGENTO_GRAPHQL_URL)' },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Forward customer auth token if the frontend sends it.
  const authorization = request.headers.get('authorization');
  if (authorization) headers.Authorization = authorization;

  // Magento supports store view selection via the `Store` header.
  const storeHeader = request.headers.get('store') || getDefaultStoreCode();
  if (storeHeader) headers.Store = storeHeader;

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(upstream, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: abortController.signal,
      cache: 'no-store',
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: 'Magento proxy request failed', message }, { status: 502 });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      message: 'Use POST for GraphQL requests',
    },
    { status: 200 }
  );
}
