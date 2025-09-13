import { writable } from "svelte/store";

export const isOpen = writable<boolean>(true);
export const isMaximize = writable<boolean>(false);

export const activeChatId = writable<string>("393d092f-1703-487f-bc85-75661f715c7d");
