export interface StorageData {
  lastUsedTool?: string;
  searchPreferences?: {
    recentSearches: string[];
  };
  theme?: 'dark' | 'light';
}

export interface StorageService {
  get<T extends keyof StorageData>(key: T): Promise<StorageData[T]>;
  set<T extends keyof StorageData>(key: T, value: StorageData[T]): Promise<void>;
}
