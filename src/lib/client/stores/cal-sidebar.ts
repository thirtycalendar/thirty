import { writable } from "svelte/store";

type PageList = "chat" | "calendar";

export const currentPage = writable<PageList>("calendar");

export function setCurrnetPage(newPage: PageList) {
  currentPage.set(newPage);
}
