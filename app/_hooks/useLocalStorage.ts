'use client';

import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};

/** true після гідратації на клієнті, false під час SSR та першого рендеру гідратації */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

/** Значення ключа localStorage як зовнішній стор: null на сервері та коли ключа немає */
export function useLocalStorageValue(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key),
    () => null
  );
}

/** Записує (або видаляє при null) значення в localStorage і сповіщає підписників у цій вкладці */
export function writeLocalStorage(key: string, value: string | null) {
  if (value === null) {
    window.localStorage.removeItem(key);
  } else {
    window.localStorage.setItem(key, value);
  }
  notify();
}
