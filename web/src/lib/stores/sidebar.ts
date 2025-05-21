import { writable } from "svelte/store";

export const sidebars = writable<Record<string, boolean>>({});

export function toggleSidebar(id: string) {
  sidebars.update((state) => {
    let updatedState = !state[id];
    localStorage.setItem(id, String(updatedState));

    return { ...state, [id]: updatedState };
  });
}
