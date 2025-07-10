import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

import type { CalView } from "$lib/shared/types";

export const calView: Writable<CalView | null> = writable(null);

if (browser) {
  const stored = localStorage.getItem("cal-view") as CalView | null;

  const validViews: CalView[] = ["month", "week", "day", "year"];
  const initialView = validViews.includes(stored as CalView) ? (stored as CalView) : "week";

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

export function changeToDayView() {
  const day = "day" as CalView;

  if (browser) {
    localStorage.setItem("cal-view", day);
  }

  calView.set(day);
}
