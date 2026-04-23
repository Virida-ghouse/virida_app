import { afterEach, beforeEach, vi } from "vitest";

class LocalStorageMock {
  private store = new Map<string, string>();

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number) {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  get length() {
    return this.store.size;
  }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: new LocalStorageMock(),
    writable: true,
    configurable: true,
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  Object.defineProperty(window, "scrollTo", {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
