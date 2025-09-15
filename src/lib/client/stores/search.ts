import { writable } from "svelte/store";

export const isSearchOpen = writable(false);
export const searchQuery = writable("");

export const searchTriggered = writable(false);

export function toggleSearch() {
  isSearchOpen.update((v) => !v);
  searchQuery.set("");
  searchTriggered.set(true);
}

export function hideSearch() {
  isSearchOpen.set(false);
  searchQuery.set("");
  searchTriggered.set(false);
}
