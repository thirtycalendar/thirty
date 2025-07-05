import { getTimeZones } from "@vvo/tzdb";

const tzdb = getTimeZones();

export function getValidTimeZone(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const exact = tzdb.find((t) => t.name === tz);
  if (exact) return exact.name;

  const alias = tzdb.find((t) => t.group.includes(tz));
  if (alias) return alias.name;

  return "UTC";
}
