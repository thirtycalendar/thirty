export function onStorageKeyChange(storageKey: string, callbackFn: () => void) {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    originalSetItem.call(this, key, value);
    if (key === storageKey) {
      callbackFn();
    }
  };

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) {
      callbackFn();
    }
  });
}
