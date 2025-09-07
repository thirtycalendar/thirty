import { get, writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

export const mainSidebarStore = createBooleanStore("main-sidebar", false);
export const emailHiddenStore = createBooleanStore("email-hidden", true);

function createBooleanStore(
  key: string,
  initial = true
): {
  store: Writable<boolean>;
  toggle: () => void;
  set: (value: boolean) => void;
  get: () => boolean;
} {
  const stored = browser ? localStorage.getItem(key) : null;
  const store = writable(stored !== null ? stored === "true" : initial);

  if (browser) {
    store.subscribe((v) => localStorage.setItem(key, String(v)));
  }

  function toggle() {
    store.update((v) => !v);
  }

  function set(value: boolean) {
    store.set(value);
  }

  function getValue() {
    return get(store);
  }

  return { store, toggle, set, get: getValue };
}
