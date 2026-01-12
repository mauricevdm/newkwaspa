import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    services: {
      magento: await checkMagentoHealth(),
      database: 'ok',
    },
  };

  return NextResponse.json(health);
}

async function checkMagentoHealth(): Promise<'ok' | 'degraded' | 'down'> {
  try {
    const magentoUrl = process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL;
    if (!magentoUrl) return 'down';

    const response = await fetch(magentoUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '{ storeConfig { store_code } }',
      }),
      signal: AbortSignal.timeout(5000),
    });

    return response.ok ? 'ok' : 'degraded';
  } catch {
    return 'down';
  }
}
