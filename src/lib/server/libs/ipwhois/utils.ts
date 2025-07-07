import { isObject } from "$lib/shared/utils";

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
