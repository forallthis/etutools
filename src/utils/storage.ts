import type { StorageService, StorageData } from '../types/storage.js';

class ChromeStorageService implements StorageService {
  async get<T extends keyof StorageData>(key: T): Promise<StorageData[T]> {
    const result = await chrome.storage.local.get(key);
    return result[key];
  }

  async set<T extends keyof StorageData>(
    key: T,
    value: StorageData[T]
  ): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  }
}

export const storage = new ChromeStorageService();
