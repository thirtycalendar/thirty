import { kv } from "../libs/upstash/kv";

export async function getLock(key: string) {
  return (await kv.get(key)) === "locked";
}

export async function setLock(key: string, val: boolean, { ttl }: { ttl: number }) {
  await kv.set(key, val ? "locked" : "", { ex: ttl });
}

export async function releaseLock(key: string) {
  await kv.del(key);
}
