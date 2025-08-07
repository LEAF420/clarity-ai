import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Suggestion {
  text: string
  confidence: string
  reasoning: string
}

export interface Conversation {
  id: string
  timestamp: Date
  input: string
  suggestions: Suggestion[]
  type: 'text' | 'voice'
}

interface ConversationStore {
  conversations: Conversation[]
  addConversation: (conversation: Omit<Conversation, 'id' | 'timestamp'>) => void
  clearConversations: () => void
  exportConversations: () => void
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      conversations: [],

      addConversation: (conversation) => {
        const newConversation: Conversation = {
          ...conversation,
          id: crypto.randomUUID(),
          timestamp: new Date()
        }

        set((state) => ({
          conversations: [newConversation, ...state.conversations]
        }))
      },

      clearConversations: () => {
        set({ conversations: [] })
      },

      exportConversations: () => {
        const { conversations } = get()
        
        const dataStr = JSON.stringify(conversations, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        
        const link = document.createElement('a')
        link.href = URL.createObjectURL(dataBlob)
        link.download = `clarity-conversations-${new Date().toISOString().split('T')[0]}.json`
        link.click()
      }
    }),
    {
      name: 'clarity-conversation-store',
      partialize: (state) => ({ conversations: state.conversations }),
      onRehydrateStorage: () => (state) => {
        // Convert date strings back to Date objects when loading from localStorage
        if (state?.conversations) {
          state.conversations = state.conversations.map(conversation => ({
            ...conversation,
            timestamp: new Date(conversation.timestamp)
          }))
        }
      }
    }
  )
) 