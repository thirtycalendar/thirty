import { get, writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

export const uncheckedCalendars = createLocalStorageStore("unchecked-calendars");
export const uncheckedBirthdays = createLocalStorageStore("unchecked-birthdays");
export const uncheckedHolidays = createLocalStorageStore("unchecked-holidays");
export const uncheckedOthers = createLocalStorageStore("unchecked-others");

export const collapsedLists = createLocalStorageStore("collapsed-lists");

function createLocalStorageStore(key: string): {
  store: Writable<string[]>;
  toggle: (id: string) => void;
  setChecked: (id: string, checked: boolean) => void;
  isChecked: (id: string) => boolean;
} {
  const stored = browser ? JSON.parse(localStorage.getItem(key) || "[]") : [];
  const store = writable<string[]>(stored);

  if (browser) {
    store.subscribe((ids) => {
      localStorage.setItem(key, JSON.stringify(ids));
    });
  }

  function toggle(id: string) {
    store.update((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  }

  function setChecked(id: string, checked: boolean) {
    store.update((ids) => {
      if (checked) {
        return ids.filter((i) => i !== id);
      } else {
        return ids.includes(id) ? ids : [...ids, id];
      }
    });
  }

  function isChecked(id: string) {
    return !get(store).includes(id);
  }

  return { store, toggle, setChecked, isChecked };
}
