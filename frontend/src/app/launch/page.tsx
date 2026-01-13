'use client';

import { useEffect, useMemo, useState } from 'react';

type StatusResponse = {
  instanceState: string;
  service: { desiredCount: number; runningCount: number; status: string };
  elasticIp?: string;
  healthy: boolean;
};

const DEFAULT_POLL_MS = 2500;

function basicAuthHeader(username: string, password: string): string {
  const token = btoa(`${username}:${password}`);
  return `Basic ${token}`;
}

export default function LaunchPage() {
  const apiBase = useMemo(() => {
    // e.g. https://xxxx.execute-api.af-south-1.amazonaws.com/dev
    return process.env.NEXT_PUBLIC_DEV_WAKE_API_BASE || '';
  }, []);

  const redirectUrl = useMemo(() => {
    // Where to send user when backend is ready
    return process.env.NEXT_PUBLIC_DEV_APP_URL || '/';
  }, []);

  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWaking, setIsWaking] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function fetchStatus() {
    if (!apiBase) {
      setError('Missing NEXT_PUBLIC_DEV_WAKE_API_BASE');
      return;
    }

    try {
      const res = await fetch(`${apiBase}/status`, { cache: 'no-store' });
      const json = (await res.json()) as StatusResponse;
      setStatus(json);
      setError(null);

      if (json.healthy) {
        window.location.href = redirectUrl;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch status');
    }
  }

  useEffect(() => {
    void fetchStatus();
    const timer = setInterval(fetchStatus, DEFAULT_POLL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, redirectUrl]);

  async function wake() {
    if (!apiBase) {
      setError('Missing NEXT_PUBLIC_DEV_WAKE_API_BASE');
      return;
    }

    setIsWaking(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/wake`, {
        method: 'POST',
        headers: {
          Authorization: basicAuthHeader(username, password),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (res.status === 401) {
        setError('Invalid credentials');
        return;
      }

      if (!res.ok) {
        const body = await res.text();
        setError(`Wake failed: ${res.status} ${body}`);
        return;
      }

      // Status poll loop will pick it up.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Wake failed');
    } finally {
      setIsWaking(false);
    }
  }

  const backendSleeping = status ? !status.healthy : true;

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Dev Launch</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This environment auto-sleeps after 1 hour of inactivity.
        </p>

        <div className="mt-4 rounded border p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Backend</span>
            <span>{status?.healthy ? 'Ready' : 'Sleeping'}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-muted-foreground">Instance</span>
            <span>{status?.instanceState ?? 'unknown'}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-muted-foreground">Service</span>
            <span>
              {status
                ? `${status.service.runningCount}/${status.service.desiredCount} (${status.service.status})`
                : 'unknown'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            {error}
          </div>
        )}

        {backendSleeping && (
          <div className="mt-4">
            <h2 className="text-sm font-medium">Start backend</h2>
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-muted-foreground">Username</span>
                <input
                  className="h-10 rounded border bg-background px-3 text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-muted-foreground">Password</span>
                <input
                  className="h-10 rounded border bg-background px-3 text-sm"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </label>
              <button
                className="h-10 rounded bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                onClick={() => void wake()}
                disabled={isWaking || !username || !password}
              >
                {isWaking ? 'Starting…' : 'Start services'}
              </button>
            </div>
          </div>
        )}

        {!backendSleeping && (
          <div className="mt-4">
            <button
              className="h-10 w-full rounded bg-primary px-4 text-sm font-medium text-primary-foreground"
              onClick={() => {
                window.location.href = redirectUrl;
              }}
            >
              Continue to site
            </button>
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          If you see “Sleeping”, enter credentials to wake it.
        </p>
      </div>
    </main>
  );
}
