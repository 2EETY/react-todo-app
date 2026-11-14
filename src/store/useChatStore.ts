import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ChatMessage } from '../types/task'

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'diary',
  text: '안녕하세요. 오늘 있었던 일이나 앞으로 할 일을 편하게 말해 주세요. "내일 오후 3시에 치과 가야 해"처럼 적으면 일정으로 옮겨 둘게요.',
  createdAt: 0,
}

interface ChatState {
  messages: ChatMessage[]
  addMessage: (role: ChatMessage['role'], text: string) => void
  clear: () => void
}

export const CHAT_STORAGE_KEY = 'harugyeol:chat'

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [WELCOME],
      addMessage: (role, text) =>
        set((s) => ({
          // 너무 길어지지 않게 최근 80개만 보관
          messages: [...s.messages, { id: crypto.randomUUID(), role, text, createdAt: Date.now() }].slice(-80),
        })),
      clear: () => set({ messages: [WELCOME] }),
    }),
    { name: CHAT_STORAGE_KEY, storage: createJSONStorage(() => localStorage) },
  ),
)
