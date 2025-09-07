import { writable } from "svelte/store";

import { authClient } from "$lib/client/utils/rpc";

import { toMs } from "$lib/shared/utils/ms";

type UserSession = {
  name: string;
  email: string;
  image: string;
};

const STORAGE_KEY = "user-session";
const ONE_DAY_MS = toMs("1d");

export const session = writable<UserSession | null>(null);

export async function initUserSession() {
  const cached = loadFromLocalStorage();
  if (cached) {
    session.set(cached);
    return;
  }

  const res = await authClient.getSession();
  if (res?.data?.user) {
    const user = {
      name: res.data.user.name,
      email: res.data.user.email,
      image: res.data.user.image || ""
    };

    session.set(user);
    saveToLocalStorage(user);
  }
}

function loadFromLocalStorage(): UserSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > ONE_DAY_MS) return null;

    return data;
  } catch {
    return null;
  }
}

function saveToLocalStorage(data: UserSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
}
