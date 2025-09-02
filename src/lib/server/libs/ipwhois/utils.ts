import { KV_IP_LOCATION } from "$lib/server/utils/kv-keys";

import { isObject } from "$lib/shared/utils";
import type { IpLocationKV } from "$lib/shared/types";

import { kv } from "../upstash/kv";

export function getTimezoneIdFromIP(data: unknown): string {
  if (isObject(data) && isObject(data.timezone) && typeof data.timezone.id === "string") {
    return data.timezone.id;
  }
  return "UTC";
}

export function getCountryNameFromIP(data: unknown): string {
  if (isObject(data) && typeof data.country === "string") {
    return data.country;
  }
  return "Unknown";
}

export function getCountryCodeFromIP(data: unknown): string {
  if (isObject(data) && typeof data.country_code === "string") {
    return data.country_code;
  }
  return "Unknown";
}

export async function cacheIPLocation(userId: string): Promise<IpLocationKV> {
  const res = await fetch("https://ipwho.is/");
  const data: unknown = await res.json();

  const timezone = getTimezoneIdFromIP(data);
  const countryName = getCountryNameFromIP(data);
  const countryCode = getCountryCodeFromIP(data);

  const value = { timezone, countryName, countryCode };

  await kv.set(KV_IP_LOCATION(userId), value, { ex: 43200 });

  return value;
}

export async function getIPLocation(userId: string): Promise<IpLocationKV> {
  const cached = await kv.get<IpLocationKV>(KV_IP_LOCATION(userId));

  if (cached) return cached;

  return await cacheIPLocation(userId);
}
