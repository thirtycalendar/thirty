import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

import { CalViews } from "$lib/shared/constants";
import type { CalView } from "$lib/shared/types";

function isCalView(value: string): value is CalView {
  return (CalViews as readonly string[]).includes(value);
}

export const currentCalendarView: Writable<CalView | null> = writable(null);

if (browser) {
  const stored = localStorage.getItem("calendar-view");
  const initialView: CalView = stored && isCalView(stored) ? stored : "week";
  currentCalendarView.set(initialView);
}

export function setCalendarView(value: CalView) {
  if (browser) {
    localStorage.setItem("calendar-view", value);
  }
  currentCalendarView.set(value);
}

export function setDayView() {
  setCalendarView("day");
}
