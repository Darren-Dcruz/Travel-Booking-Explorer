export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const memoryStore = new Map<string, string>();

const memoryStorage: StorageLike = {
  getItem(key: string): string | null {
    return memoryStore.has(key) ? (memoryStore.get(key) as string) : null;
  },
  setItem(key: string, value: string): void {
    memoryStore.set(key, value);
  },
  removeItem(key: string): void {
    memoryStore.delete(key);
  },
};

export function getSafeStorage(): StorageLike {
  const candidate = (globalThis as { localStorage?: StorageLike }).localStorage;

  if (
    candidate &&
    typeof candidate.getItem === 'function' &&
    typeof candidate.setItem === 'function' &&
    typeof candidate.removeItem === 'function'
  ) {
    return candidate;
  }

  return memoryStorage;
}
