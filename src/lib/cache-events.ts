export const CACHE_STORAGE_UPDATED_EVENT = "tinitiate:cache-storage-updated";

export type CacheStorageUpdatedDetail = {
  cacheName?: string;
  url?: string;
};

export const notifyCacheStorageUpdated = (detail: CacheStorageUpdatedDetail = {}) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<CacheStorageUpdatedDetail>(CACHE_STORAGE_UPDATED_EVENT, {
      detail,
    })
  );
};
