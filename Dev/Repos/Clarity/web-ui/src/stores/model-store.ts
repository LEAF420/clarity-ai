import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { modelStorage } from '@/lib/storage'
import { KNOWN_MODEL_HASHES, MODEL_VALIDATION, UI_MESSAGES } from '@/lib/constants'


export interface ModelStatus {
  isImported: boolean
  isLoaded: boolean
  fileName?: string
  fileSize?: number
  sha256?: string
  importProgress: number
  error?: string
  isVerified?: boolean
  verificationStatus?: 'verified' | 'unverified' | 'failed'
}

interface ModelStore {
  modelStatus: ModelStatus
  setModelStatus: (status: Partial<ModelStatus>) => void
  importModel: (file: File) => Promise<void>
  verifyModel: () => Promise<boolean>
  resetModel: () => void
  checkStorageQuota: () => Promise<{ hasQuota: boolean; usage: number; quota: number }>
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      modelStatus: {
        isImported: false,
        isLoaded: false,
        importProgress: 0,
        verificationStatus: 'unverified'
      },

      setModelStatus: (status: Partial<ModelStatus>) => {
        set((state) => ({
          modelStatus: { ...state.modelStatus, ...status }
        }))
      },

      checkStorageQuota: async () => {
        try {
          const { usage, quota } = await modelStorage.getStorageQuota()
          const hasQuota = (quota ?? 0) > (usage ?? 0) + 2 * 1024 * 1024 * 1024 // Need at least 2GB free
          return { hasQuota, usage: usage ?? 0, quota: quota ?? 0 }
        } catch (error) {
          return { hasQuota: false, usage: 0, quota: 0 }
        }
      },

      importModel: async (file: File) => {
        const { setModelStatus, checkStorageQuota } = get();
        const CHUNK_SIZE = 16 * 1024 * 1024; // 16MB chunks

        try {
          // Reset status
          setModelStatus({
            importProgress: 0,
            error: undefined,
            verificationStatus: 'unverified',
          });

          // Step 1: Validate file type and size
          if (!file.name.endsWith(MODEL_VALIDATION.EXPECTED_EXTENSION)) {
            throw new Error(UI_MESSAGES.INVALID_FILE_TYPE);
          }
          if (file.size < MODEL_VALIDATION.MIN_SIZE) {
            throw new Error('File too small. Please select a valid model file.');
          }
          if (file.size > MODEL_VALIDATION.MAX_SIZE) {
            throw new Error(UI_MESSAGES.FILE_TOO_LARGE);
          }

          // Step 2: Check storage quota
          const { hasQuota, usage, quota } = await checkStorageQuota();
          if (!hasQuota) {
            const availableGB = Math.floor(
              ((quota || 0) - (usage || 0)) / (1024 * 1024 * 1024)
            );
            throw new Error(
              `${UI_MESSAGES.STORAGE_QUOTA_EXCEEDED} (Available: ${availableGB}GB)`
            );
          }

          // Step 3: Store model in chunks
          await modelStorage.clearChunks();
          let offset = 0;
          while (offset < file.size) {
            const chunk = file.slice(offset, offset + CHUNK_SIZE);
            await modelStorage.storeModelChunk(chunk, offset);
            offset += chunk.size;
            setModelStatus({ importProgress: (offset / file.size) * 80 }); // 80% for chunking
          }

          // Step 4: Calculate SHA256 hash from chunks
          const sha256 = await modelStorage.calculateSHA256FromChunks();
          setModelStatus({ importProgress: 90 });

          // Step 5: Verify against known hashes
          const knownModel = KNOWN_MODEL_HASHES[sha256];
          const isVerified = !!knownModel;

          // Step 6: Update final status
          setModelStatus({
            isImported: true,
            isLoaded: true,
            fileName: file.name,
            fileSize: file.size,
            sha256,
            importProgress: 100,
            error: undefined,
            verificationStatus: isVerified ? 'verified' : 'unverified',
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : UI_MESSAGES.IMPORT_ERROR;
          setModelStatus({
            error: errorMessage,
            importProgress: 0,
            verificationStatus: 'failed',
          });
          throw error;
        }
      },

      verifyModel: async () => {
        const { modelStatus } = get()
        
        if (!modelStatus.isImported) {
          return false
        }

        try {
          const storedModel = await modelStorage.getModel()
          if (!storedModel) {
            return false
          }

          // Verify the stored model matches our status
          return storedModel.metadata.sha256 === modelStatus.sha256
        } catch (error) {
          return false
        }
      },

      resetModel: async () => {
        try {
          await modelStorage.deleteModel()
        } catch (error) {
          // Silent fail for storage cleanup
        }
        
        set({
          modelStatus: {
            isImported: false,
            isLoaded: false,
            importProgress: 0,
            verificationStatus: 'unverified',
            fileName: undefined,
            fileSize: undefined,
            sha256: undefined,
            error: undefined
          }
        })
      }
    }),
    {
      name: 'clarity-model-store',
      partialize: (state) => ({ modelStatus: state.modelStatus })
    }
  )
) 