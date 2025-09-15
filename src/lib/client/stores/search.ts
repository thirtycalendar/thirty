import { writable } from "svelte/store";

export const isSearchOpen = writable(false);
export const searchQuery = writable("");

export async function toggleSearch() {
  isSearchOpen.update((v) => !v);
  searchQuery.set("");
}

export function hideSearch() {
  isSearchOpen.set(false);
  searchQuery.set("");
}
