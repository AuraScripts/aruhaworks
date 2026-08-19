/**
 * Recent payments storage.
 *
 * Uses Upstash Redis REST API when configured (recommended for Vercel).
 * Falls back to an in-memory list (dev only — resets on cold starts).
 *
 * Env vars:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

export type RecentPayment = {
  id: string;
  user: string;
  amount: string;
  currency: string;
  time: string; // ISO string
  timestamp: number;
};

const KEY = "aruhaworks:recent_payments";
const MAX = 20;

const memory: RecentPayment[] = [];

function hasRedis() {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function redisCommand(command: unknown[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Redis error ${res.status}: ${t}`);
  }
  const json = await res.json();
  return json.result;
}

export async function addPayment(payment: RecentPayment): Promise<void> {
  if (hasRedis()) {
    await redisCommand(["LPUSH", KEY, JSON.stringify(payment)]);
    await redisCommand(["LTRIM", KEY, 0, MAX - 1]);
    return;
  }
  memory.unshift(payment);
  if (memory.length > MAX) memory.length = MAX;
}

export async function getPayments(): Promise<RecentPayment[]> {
  if (hasRedis()) {
    const rows = (await redisCommand(["LRANGE", KEY, 0, MAX - 1])) as string[];
    return (rows || [])
      .map((r) => {
        try {
          return JSON.parse(r) as RecentPayment;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as RecentPayment[];
  }
  return [...memory];
}

export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  if (sameDay) return `Today ${time}`;
  return (
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
    ` ${time}`
  );
}
