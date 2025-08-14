import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

import { CalViews } from "$lib/shared/constants";
import type { CalView as CalViewType } from "$lib/shared/types";

function isCalView(value: string): value is CalViewType {
  return (CalViews as readonly string[]).includes(value);
}

export const calView: Writable<CalViewType | null> = writable(null);

if (browser) {
  const stored = localStorage.getItem("cal-view");
  const initialView: CalViewType = stored && isCalView(stored) ? stored : "week";
  calView.set(initialView);
}

export function handleCalViewChange(event: Event) {
  const { name } = event.target as HTMLInputElement;

  if (!isCalView(name)) return;

  if (browser) {
    localStorage.setItem("cal-view", name);
  }

  calView.set(name);
}

export function changeToDayView() {
  const day: CalViewType = "day";

  if (browser) {
    localStorage.setItem("cal-view", day);
  }

  calView.set(day);
}
