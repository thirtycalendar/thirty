import { writable } from "svelte/store";

export const mainSidebarId = "main-side-bar";
export const chatSidebarId = "chat-side-bar";

const initialState: Record<string, boolean> = {};

if (typeof localStorage !== "undefined") {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && localStorage.getItem(key) !== null) {
      const value = localStorage.getItem(key);
      initialState[key] = value === "true";
    }
  }
}

export const sidebars = writable<Record<string, boolean>>(initialState);

export function toggleSidebar(id: string) {
  sidebars.update((state) => {
    const updatedState = !state[id];
    localStorage.setItem(id, String(updatedState));
    return { ...state, [id]: updatedState };
  });
}
