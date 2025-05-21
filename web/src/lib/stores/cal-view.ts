import { writable } from "svelte/store";

export type CalView = "year" | "month" | "week" | "day";

const defaultView: CalView =
  typeof window !== "undefined"
    ? (localStorage.getItem("cal-view") as CalView)
    : "week";

export const calView = writable<CalView>(defaultView);

export function handleCalViewChange(event: Event) {
  const { name } = event.target as HTMLInputElement;

  if (typeof window !== "undefined") {
    localStorage.setItem("cal-view", name);
  }

  calView.set(name as CalView);
}
