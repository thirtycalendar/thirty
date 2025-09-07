import { get, writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

export const uncheckedCalendars = createCheckedStore("unchecked-calendars");
export const uncheckedBirthdays = createCheckedStore("unchecked-birthdays");
export const uncheckedHolidays = createCheckedStore("unchecked-holidays");
export const uncheckedOthers = createCheckedStore("unchecked-others");

export const collapsedLists = createCheckedStore("collapsed-lists");

function createCheckedStore(key: string): {
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
      if (checked) return ids.filter((i) => i !== id);
      return ids.includes(id) ? ids : [...ids, id];
    });
  }

  function isChecked(id: string) {
    return !get(store).includes(id);
  }

  return { store, toggle, setChecked, isChecked };
}
