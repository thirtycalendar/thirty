import { get, writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

function createUncheckedStore(key: string): {
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

export const uncheckedCalendars = createUncheckedStore("unchecked-calendars");
export const uncheckedBirthdays = createUncheckedStore("unchecked-birthdays");
export const uncheckedHolidays = createUncheckedStore("unchecked-holidays");
export const uncheckedOthers = createUncheckedStore("unchecked-others");
