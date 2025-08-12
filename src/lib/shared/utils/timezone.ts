import { getTimeZones } from "@vvo/tzdb";

const tzdb = getTimeZones();

export function getValidTimeZone(tz?: string): string {
  const target = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const exact = tzdb.find((t) => t.name === target);
  if (exact) return exact.name;

  const alias = tzdb.find((t) => t.group.includes(target));
  if (alias) return alias.name;

  return "UTC";
}
