import { writable } from "svelte/store";

export const isOpen = writable<boolean>(true);
export const isMaximize = writable<boolean>(true);
