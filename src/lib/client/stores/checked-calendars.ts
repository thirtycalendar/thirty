import { writable } from "svelte/store";
import { browser } from "$app/environment";

const checkedStatus = browser ? JSON.parse(localStorage.getItem("checked-calendars") || "{}") : {};

export const checkedCalendars = writable<Record<string, boolean>>(checkedStatus);

if (browser) {
  checkedCalendars.subscribe((value) => {
    localStorage.setItem("checked-calendars", JSON.stringify(value));
  });
}
