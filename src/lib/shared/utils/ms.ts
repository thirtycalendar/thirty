type TimeUnit = "d" | "h" | "m" | "s" | "ms";

const UNIT_MS: Record<TimeUnit, number> = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
  ms: 1
};

const UNIT_NAMES: Record<TimeUnit, string> = {
  d: "day",
  h: "hour",
  m: "minute",
  s: "second",
  ms: "millisecond"
};

type DurationPart = `${number}${TimeUnit}`;

type DurationString =
  | DurationPart
  | `${DurationPart} ${DurationPart}`
  | `${DurationPart} ${DurationPart} ${DurationPart}`
  | `${DurationPart} ${DurationPart} ${DurationPart} ${DurationPart}`
  | `${DurationPart} ${DurationPart} ${DurationPart} ${DurationPart} ${DurationPart}`;

type EnsureDuration<T extends string> = T extends DurationString
  ? T
  : "number + unit (d, h, m, s, ms). Example: 1d 3h 2m";

/**
 * Convert a duration string to milliseconds
 * Returns NaN for invalid inputs
 */
export function toMs<T extends string>(duration: EnsureDuration<T>): number {
  const parts = duration.trim().split(/\s+/);
  let total = 0;

  for (const part of parts) {
    const match = part.match(/^(\d+(\.\d+)?)(d|h|m|s|ms)$/);
    if (!match) return NaN;
    const [, numStr, , unit] = match;
    total += Number(numStr) * UNIT_MS[unit as TimeUnit];
  }

  return total;
}

/**
 * Convert milliseconds to a human-readable string
 * Supports long and short formats
 */
export function fromMs(ms: number, long = false): string {
  if (ms === 0) return long ? "0 milliseconds" : "0ms";

  const units: TimeUnit[] = ["d", "h", "m", "s", "ms"];
  let remaining = ms;
  const parts: string[] = [];

  for (const unit of units) {
    const factor = UNIT_MS[unit];
    if (remaining >= factor) {
      const value = Math.floor(remaining / factor);
      remaining %= factor;

      parts.push(long ? `${value} ${UNIT_NAMES[unit]}${value > 1 ? "s" : ""}` : `${value}${unit}`);
    }
  }

  return parts.join(" ");
}
