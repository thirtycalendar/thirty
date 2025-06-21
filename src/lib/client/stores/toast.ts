import { writable } from "svelte/store";

interface Toast {
  id: string;
  message: string;
  isError?: boolean;
}

const toasts = writable<Toast[]>([]);

const showToast = (message: string, isError = false, durationInMs = 3000) => {
  const id = Math.random().toString(36).substring(2, 9);

  toasts.update((currentToasts) => [...currentToasts, { id, message, isError }]);

  setTimeout(() => {
    toasts.update((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, durationInMs);
};

const removeToast = (id: string) => {
  toasts.update((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
};

export { toasts, showToast, removeToast };
