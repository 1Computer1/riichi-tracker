import { useState } from "react";

export default function useLocalStorage(
  key: string,
): [string | null, (newValue: string | null) => void] {
  const [value, setValue_] = useState(localStorage.getItem(key));
  const setValue = (newValue: string | null) => {
    if (newValue == null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, newValue);
    }
    setValue_(newValue);
    window.dispatchEvent(new StorageEvent("local-storage", { key }));
  };
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key && e.key === key) {
      setValue_(localStorage.getItem(e.key));
    }
  });
  // @ts-expect-error custom event
  window.addEventListener("local-storage", (e: StorageEvent) => {
    if (e.key && e.key === key) {
      setValue_(localStorage.getItem(e.key));
    }
  });
  return [value, setValue];
}
