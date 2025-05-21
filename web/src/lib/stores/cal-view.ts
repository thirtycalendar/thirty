import { writable } from "svelte/store";

export type CalView = "month" | "week" | "day";

export const calView = writable<CalView>("week");

export function handleCalViewChange(event: Event) {
  const { name } = event.target as HTMLInputElement;
  calView.set(name as CalView);
}
