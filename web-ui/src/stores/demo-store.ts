import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { openRouterAPI } from '@/lib/api'

export interface DemoStatus {
  isDemoMode: boolean
  isOnline: boolean
  apiConfigured: boolean
  lastError?: string
}

interface DemoStore {
  demoStatus: DemoStatus
  setDemoMode: (enabled: boolean) => void
  checkOnlineStatus: () => void
  checkAPIConfig: () => void
  getSuggestions: (userInput: string) => Promise<any[]>
  resetDemoMode: () => void
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      demoStatus: {
        isDemoMode: false,
        isOnline: navigator.onLine,
        apiConfigured: false,
      },

      setDemoMode: (enabled: boolean) => {
        console.log('Setting demo mode to:', enabled)
        set((state) => ({
          demoStatus: {
            ...state.demoStatus,
            isDemoMode: enabled,
            lastError: undefined,
          }
        }))
      },

      checkOnlineStatus: () => {
        const isOnline = navigator.onLine
        set((state) => ({
          demoStatus: {
            ...state.demoStatus,
            isOnline,
          }
        }))
      },

      checkAPIConfig: () => {
        const apiConfigured = openRouterAPI.isConfigured()
        set((state) => ({
          demoStatus: {
            ...state.demoStatus,
            apiConfigured,
          }
        }))
      },

      getSuggestions: async (userInput: string) => {
        const { demoStatus } = get()
        
        if (!demoStatus.isDemoMode) {
          throw new Error('Demo mode not enabled')
        }

        if (!demoStatus.isOnline) {
          throw new Error('No internet connection. Demo mode requires online access.')
        }

        if (!demoStatus.apiConfigured) {
          throw new Error('Demo mode not available (API key/config missing).')
        }

        try {
          const suggestions = await openRouterAPI.getSuggestions(userInput)
          set((state) => ({
            demoStatus: {
              ...state.demoStatus,
              lastError: undefined,
            }
          }))
          return suggestions
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          set((state) => ({
            demoStatus: {
              ...state.demoStatus,
              lastError: errorMessage,
            }
          }))
          
          // Re-throw with more context
          if (errorMessage.includes('API request failed')) {
            throw new Error('OpenRouter API is unavailable. Please try again later.')
          } else if (errorMessage.includes('parsing failed')) {
            throw new Error('Received invalid response from API. Please try again.')
          } else {
            throw error
          }
        }
      },

      resetDemoMode: () => {
        set({
          demoStatus: {
            isDemoMode: false,
            isOnline: navigator.onLine,
            apiConfigured: openRouterAPI.isConfigured(),
            lastError: undefined,
          }
        })
      }
    }),
    {
      name: 'clarity-demo-store',
      partialize: (state) => ({ demoStatus: state.demoStatus })
    }
  )
) 