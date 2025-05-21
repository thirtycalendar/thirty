import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

export type CalView = "month" | "week" | "day" | "year";

export const calView: Writable<CalView | null> = writable(null);

if (browser) {
  const stored = localStorage.getItem("cal-view") as CalView | null;

  const validViews: CalView[] = ["month", "week", "day", "year"];
  const initialView = validViews.includes(stored as CalView)
    ? (stored as CalView)
    : "week";

  calView.set(initialView);
}

export function handleCalViewChange(event: Event) {
  const { name } = event.target as HTMLInputElement;

  if (!["month", "week", "day", "year"].includes(name)) return;

  if (browser) {
    localStorage.setItem("cal-view", name);
  }

  calView.set(name as CalView);
}
