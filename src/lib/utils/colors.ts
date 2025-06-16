export const colors = [
  { id: "1", colorHexCode: "#ac725e" },
  { id: "2", colorHexCode: "#d06b64" },
  { id: "3", colorHexCode: "#f83a22" },
  { id: "4", colorHexCode: "#fa573c" },
  { id: "5", colorHexCode: "#ff7537" },
  { id: "6", colorHexCode: "#ffad46" },
  { id: "7", colorHexCode: "#42d692" },
  { id: "8", colorHexCode: "#16a765" },
  { id: "9", colorHexCode: "#7bd148" },
  { id: "10", colorHexCode: "#b3dc6c" },
  { id: "11", colorHexCode: "#fbe983" },
  { id: "12", colorHexCode: "#fad165" },
  { id: "13", colorHexCode: "#92e1c0" },
  { id: "14", colorHexCode: "#9fe1e7" },
  { id: "15", colorHexCode: "#9fc6e7" },
  { id: "16", colorHexCode: "#4986e7" },
  { id: "17", colorHexCode: "#9a9cff" },
  { id: "18", colorHexCode: "#b99aff" },
  { id: "19", colorHexCode: "#c2c2c2" },
  { id: "20", colorHexCode: "#cabdbf" },
  { id: "21", colorHexCode: "#cca6ac" },
  { id: "22", colorHexCode: "#f691b2" },
  { id: "23", colorHexCode: "#cd74e6" },
  { id: "24", colorHexCode: "#a47ae2" }
];

export function getRandomColorId(): string {
  const random = Math.floor(Math.random() * colors.length);
  return colors[random].id;
}

export function getColorHexCodeFromId(id: string): string {
  return colors.find((c) => c.id === id)?.colorHexCode ?? "transparent";
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

export function getNearestColorHexCode(hexCode: string): string {
  const targetRgb = hexToRgb(hexCode);

  let closestColor = colors[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const color of colors) {
    const [r1, g1, b1] = targetRgb;
    const [r2, g2, b2] = hexToRgb(color.colorHexCode);

    const distance = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }

  return closestColor.colorHexCode;
}
