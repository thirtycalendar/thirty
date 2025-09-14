import { writable } from "svelte/store";

export const isOpen = writable<boolean>(false);
export const isMaximize = writable<boolean>(false);

export const activeChatId = writable<string>("");
