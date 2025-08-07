// Known SHA256 hashes for verified Gemma 3n models
export const KNOWN_MODEL_HASHES: Record<string, { name: string; size: string; source: string }> = {
  // Test hash for development (replace with real hashes when available)
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855': {
    name: 'test-model.gguf',
    size: '~1KB',
    source: 'Test Model'
  }
  // Real hashes will be added here as models become available:
  // 'actual_sha256_hash_here': {
  //   name: 'gemma-3n-e2b-it-q4_k_m.gguf',
  //   size: '~1.2GB',
  //   source: 'Google DeepMind (Official)'
  // }
}

// Model validation constants
export const MODEL_VALIDATION = {
  MIN_SIZE: 100 * 1024 * 1024, // 100MB minimum
  MAX_SIZE: 15 * 1024 * 1024 * 1024, // 15GB maximum
  EXPECTED_EXTENSION: '.gguf',
  EXPECTED_PREFIXES: ['gemma-3n', 'gemma3n']
}

// Storage constants
export const STORAGE_KEYS = {
  MODEL_IMPORTED: 'clarity-model-imported',
  ONBOARDING_COMPLETE: 'clarity-onboarding-complete'
}

// UI constants
export const UI_MESSAGES = {
  IMPORT_SUCCESS: 'Model imported and verified successfully!',
  IMPORT_UNVERIFIED: 'Model imported. Verification status unknown.',
  IMPORT_ERROR: 'Failed to import model',
  FILE_TOO_LARGE: 'File size too large. Please select a smaller model file.',
  INVALID_FILE_TYPE: 'Please select a valid GGUF model file (.gguf extension)',
  STORAGE_QUOTA_EXCEEDED: 'Not enough storage space. Please free up space and try again.',
  FILE_READ_ERROR: 'Failed to read file. Please try again.',
  VERIFICATION_FAILED: 'Model verification failed. The file may be corrupted.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.'
} 