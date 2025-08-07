import { openDB, DBSchema } from 'idb';

const DB_NAME = 'ClarityDB';
const DB_VERSION = 1;
const MODEL_STORE_NAME = 'modelStore';
const CHUNK_STORE_NAME = 'chunkStore';

interface ClarityDB extends DBSchema {
  [MODEL_STORE_NAME]: {
    key: string;
    value: {
      file: File;
      metadata: {
        sha256: string;
        fileName: string;
      };
    };
  };
  [CHUNK_STORE_NAME]: {
    key: number;
    value: Blob;
  };
}

const dbPromise = openDB<ClarityDB>(DB_NAME, DB_VERSION, {
  upgrade(db: import("idb").IDBPDatabase<ClarityDB>) {
    if (!db.objectStoreNames.contains(MODEL_STORE_NAME)) {
      db.createObjectStore(MODEL_STORE_NAME);
    }
    if (!db.objectStoreNames.contains(CHUNK_STORE_NAME)) {
      db.createObjectStore(CHUNK_STORE_NAME);
    }
  },
});

export const modelStorage = {
  async storeModel(
    file: File,
    metadata: { sha256: string; fileName: string }
  ) {
    const db = await dbPromise;
    await db.put(MODEL_STORE_NAME, { file, metadata }, 'model');
  },

  async getModel() {
    const db = await dbPromise;
    return db.get(MODEL_STORE_NAME, 'model');
  },

  async deleteModel() {
    const db = await dbPromise;
    await db.delete(MODEL_STORE_NAME, 'model');
  },

  async getStorageQuota() {
    if (navigator.storage && navigator.storage.estimate) {
      return navigator.storage.estimate();
    }
    return { usage: 0, quota: 0 };
  },

  async clearChunks() {
    const db = await dbPromise;
    await db.clear(CHUNK_STORE_NAME);
  },

  async storeModelChunk(chunk: Blob, offset: number) {
    const db = await dbPromise;
    await db.put(CHUNK_STORE_NAME, chunk, offset);
  },

  async calculateSHA256FromChunks() {
    const db = await dbPromise;
    const chunks = await db.getAll(CHUNK_STORE_NAME);
    const blob = new Blob(chunks);
    const buffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  },
};