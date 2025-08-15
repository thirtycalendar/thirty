import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

import { CalViews } from "$lib/shared/constants";
import type { CalView } from "$lib/shared/types";

function isCalView(value: string): value is CalView {
  return (CalViews as readonly string[]).includes(value);
}

export const currentCalView: Writable<CalView | null> = writable(null);

if (browser) {
  const stored = localStorage.getItem("cal-view");
  const initialView: CalView = stored && isCalView(stored) ? stored : "week";
  currentCalView.set(initialView);
}

export function setCalView(value: CalView) {
  if (browser) {
    localStorage.setItem("cal-view", value);
  }
  currentCalView.set(value);
}

export function setDayView() {
  setCalView("day");
}
