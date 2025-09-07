type TimeUnit = "d" | "h" | "m" | "s" | "ms";

const UNIT_MS: Record<TimeUnit, number> = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
  ms: 1
};

export function toMs(duration: string): number {
  const parts = duration.trim().split(/\s+/);
  let total = 0;

  for (const part of parts) {
    const match = part.match(/^(\d+)(d|h|m|s|ms)$/);
    if (!match) throw new Error(`Invalid duration part: "${part}"`);
    const [, numStr, unit] = match;
    total += Number(numStr) * UNIT_MS[unit as TimeUnit];
  }

  return total;
}

export function fromMs(ms: number, long = false): string {
  if (ms === 0) return long ? "0 milliseconds" : "0ms";

  const units: [TimeUnit, number][] = [
    ["d", UNIT_MS.d],
    ["h", UNIT_MS.h],
    ["m", UNIT_MS.m],
    ["s", UNIT_MS.s],
    ["ms", UNIT_MS.ms]
  ];

  const parts: string[] = [];

  let remaining = ms;

  for (const [unit, factor] of units) {
    if (remaining >= factor) {
      const value = Math.floor(remaining / factor);
      remaining %= factor;
      if (long) {
        const name =
          unit === "ms"
            ? "millisecond"
            : unit === "s"
              ? "second"
              : unit === "m"
                ? "minute"
                : unit === "h"
                  ? "hour"
                  : "day";
        parts.push(`${value} ${name}${value > 1 ? "s" : ""}`);
      } else {
        parts.push(`${value}${unit}`);
      }
    }
  }

  return parts.join(long ? " " : " ");
}
