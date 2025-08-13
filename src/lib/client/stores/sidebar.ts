import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

// Main sidebar
export const mainSidebarId = "main-side-bar";

export function toggleMainSidebar() {
  toggleSidebar(mainSidebarId);
}

export function mainSidebarState(): Writable<boolean> {
  return sidebarState(mainSidebarId);
}

// Utils
const sidebarStates = new Map<string, Writable<boolean>>();

export function sidebarState(id: string, initial = false): Writable<boolean> {
  if (!sidebarStates.has(id)) {
    const startValue =
      browser && localStorage.getItem(id) !== null ? localStorage.getItem(id) === "true" : initial;

    const store = writable(startValue);

    if (browser) {
      store.subscribe((v) => localStorage.setItem(id, String(v)));
    }

    sidebarStates.set(id, store);
  }
  return sidebarStates.get(id)!;
}

export function toggleSidebar(id: string) {
  sidebarState(id).update((v) => !v);
}
