import { readable } from "svelte/store";

import { chatSidebarId, sidebars } from "$lib/stores/sidebar";

function mediaQueryStore(query: string, onMatch?: (match: boolean) => void) {
  return readable(false, (set) => {
    const media = window.matchMedia(query);
    const update = () => {
      set(media.matches);
      onMatch?.(media.matches);
    };
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  });
}

export const isSm = mediaQueryStore("(min-width: 425px)");
export const isMd = mediaQueryStore("(min-width: 768px)");
export const isLg = mediaQueryStore("(min-width: 1024px)");

export const isHideChatIcon = mediaQueryStore("(min-width: 884px)", (match) => {
  const isMatch = !match;
  if (isMatch) {
    sidebars.update((state) => {
      if (state[chatSidebarId]) {
        localStorage.setItem(chatSidebarId, "false");
        return { ...state, [chatSidebarId]: false };
      }
      return state;
    });
  }
});
