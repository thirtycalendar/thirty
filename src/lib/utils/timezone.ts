import { getTimeZones } from "@vvo/tzdb";

const tzdb = getTimeZones();
const validTzNames = new Set(tzdb.map((t) => t.name));

function normalize(str: string) {
  return str.toLowerCase().replace(/[^a-z]/g, "");
}

export function getValidTimeZone(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (validTzNames.has(tz)) return tz;

  const normalized = normalize(tz);

  const fuzzyMatch = tzdb.find(
    (tzObj) =>
      normalize(tzObj.name) === normalized || normalize(tzObj.alternativeName ?? "") === normalized
  );

  return fuzzyMatch?.name ?? "UTC";
}
