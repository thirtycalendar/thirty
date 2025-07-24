import { Color } from "../constants";

type HexColor = (typeof Color)[number];

export function getRandomColor(): HexColor {
  const random = Math.floor(Math.random() * Color.length);
  return Color[random];
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid hex color: ${hex}`);
  return [
    Number.parseInt(result[1], 16),
    Number.parseInt(result[2], 16),
    Number.parseInt(result[3], 16)
  ];
}

export function getNearestColor(hexCode: string): HexColor {
  const targetRgb = hexToRgb(hexCode);

  return Color.reduce(
    (closest, currentColor) => {
      const [r1, g1, b1] = targetRgb;
      const [r2, g2, b2] = hexToRgb(currentColor);

      const distance = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);

      return distance < closest.distance ? { color: currentColor, distance } : closest;
    },

    { color: Color[0], distance: Number.POSITIVE_INFINITY } as { color: HexColor; distance: number }
  ).color;
}
