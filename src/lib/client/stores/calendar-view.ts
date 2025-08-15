import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

import { CalendarViews } from "$lib/shared/constants";
import type { CalendarView } from "$lib/shared/types";

function isCalendarView(value: string): value is CalendarView {
  return (CalendarViews as readonly string[]).includes(value);
}

export const currentCalendarView: Writable<CalendarView | null> = writable(null);

if (browser) {
  const stored = localStorage.getItem("calendar-view");
  const initialView: CalendarView = stored && isCalendarView(stored) ? stored : "week";
  currentCalendarView.set(initialView);
}

export function setCalendarView(value: CalendarView) {
  if (browser) {
    localStorage.setItem("calendar-view", value);
  }
  currentCalendarView.set(value);
}

export function setDayView() {
  setCalendarView("day");
}
