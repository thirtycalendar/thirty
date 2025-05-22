import { readable } from "svelte/store";

export const isSm = readable(true, (set) => {
  const media = window.matchMedia("(min-width: 425px)");
  const update = () => set(media.matches);
  media.addEventListener("change", update);
  update();
  return () => media.removeEventListener("change", update);
});

export const isMd = readable(true, (set) => {
  const media = window.matchMedia("(min-width: 768px)");
  const update = () => set(media.matches);
  media.addEventListener("change", update);
  update();
  return () => media.removeEventListener("change", update);
});

export const isLg = readable(true, (set) => {
  const media = window.matchMedia("(min-width: 1024px)");
  const update = () => set(media.matches);
  media.addEventListener("change", update);
  update();
  return () => media.removeEventListener("change", update);
});
