import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OllamaAPI } from '@/lib/ollama'

export interface OllamaStatus {
  isOllamaMode: boolean
  serverUrl: string
  modelName: string
  isConnected: boolean
  isModelAvailable: boolean
  lastError?: string
  lastTestTime?: number
}

interface OllamaStore {
  ollamaStatus: OllamaStatus
  ollamaAPI: OllamaAPI | null
  setOllamaMode: (enabled: boolean) => void
  updateConfig: (serverUrl: string, modelName: string) => void
  testConnection: () => Promise<{ connected: boolean; error?: string }>
  testModel: () => Promise<{ available: boolean; error?: string }>
  getSuggestions: (userInput: string) => Promise<any[]>
  resetOllamaMode: () => void
}

export const useOllamaStore = create<OllamaStore>()(
  persist(
    (set, get) => ({
      ollamaStatus: {
        isOllamaMode: false,
        serverUrl: 'http://localhost:11434',
        modelName: 'gemma3n:latest',
        isConnected: false,
        isModelAvailable: false,
      },
      ollamaAPI: null,

      setOllamaMode: (enabled: boolean) => {
        set((state) => ({
          ollamaStatus: {
            ...state.ollamaStatus,
            isOllamaMode: enabled,
            lastError: undefined,
          }
        }))
      },

      updateConfig: (serverUrl: string, modelName: string) => {
        set((state) => ({
          ollamaStatus: {
            ...state.ollamaStatus,
            serverUrl,
            modelName,
            isConnected: false,
            isModelAvailable: false,
            lastError: undefined,
          },
          ollamaAPI: new OllamaAPI({ serverUrl, modelName })
        }))
      },

      testConnection: async () => {
        const { ollamaStatus } = get()
        const api = new OllamaAPI({ 
          serverUrl: ollamaStatus.serverUrl, 
          modelName: ollamaStatus.modelName 
        })
        
        const result = await api.testConnection()
        
        set((state) => ({
          ollamaStatus: {
            ...state.ollamaStatus,
            isConnected: result.connected,
            lastError: result.error,
            lastTestTime: Date.now(),
          }
        }))
        
        return result
      },

      testModel: async () => {
        const { ollamaStatus } = get()
        const api = new OllamaAPI({ 
          serverUrl: ollamaStatus.serverUrl, 
          modelName: ollamaStatus.modelName 
        })
        
        const result = await api.testModel()
        
        set((state) => ({
          ollamaStatus: {
            ...state.ollamaStatus,
            isModelAvailable: result.available,
            lastError: result.error,
            lastTestTime: Date.now(),
          }
        }))
        
        return result
      },

      getSuggestions: async (userInput: string) => {
        const { ollamaStatus } = get()
        
        if (!ollamaStatus.isOllamaMode) {
          throw new Error('Ollama mode not enabled')
        }

        if (!ollamaStatus.isConnected) {
          throw new Error('Ollama server not connected. Please test connection first.')
        }

        if (!ollamaStatus.isModelAvailable) {
          throw new Error('Ollama model not available. Please test model first.')
        }

        try {
          const api = new OllamaAPI({ 
            serverUrl: ollamaStatus.serverUrl, 
            modelName: ollamaStatus.modelName 
          })
          
          const suggestions = await api.generateSuggestions(userInput)
          
          set((state) => ({
            ollamaStatus: {
              ...state.ollamaStatus,
              lastError: undefined,
            }
          }))
          
          return suggestions
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          set((state) => ({
            ollamaStatus: {
              ...state.ollamaStatus,
              lastError: errorMessage,
            }
          }))
          
          // Re-throw with more context
          if (errorMessage.includes('Ollama API error')) {
            throw new Error('Ollama server error. Please check if Ollama is running.')
          } else if (errorMessage.includes('parsing failed')) {
            throw new Error('Received invalid response from Ollama. Please try again.')
          } else {
            throw error
          }
        }
      },

              resetOllamaMode: () => {
          set({
            ollamaStatus: {
              isOllamaMode: false,
              serverUrl: 'http://localhost:11434',
              modelName: 'gemma3n:latest',
              isConnected: false,
              isModelAvailable: false,
              lastError: undefined,
              lastTestTime: undefined,
            },
            ollamaAPI: null
          })
        }
    }),
    {
      name: 'clarity-ollama-store',
      partialize: (state) => ({ ollamaStatus: state.ollamaStatus })
    }
  )
) 