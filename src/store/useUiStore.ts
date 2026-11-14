import { create } from 'zustand'
import { todayKey } from '../lib/date'

/** 저장하지 않는 화면 상태 (새로고침하면 초기화) */
interface UiState {
  selectedDate: string
  mobileView: 'chat' | 'schedule'
  toasts: { id: string; text: string }[]
  setSelectedDate: (key: string) => void
  setMobileView: (view: UiState['mobileView']) => void
  pushToast: (text: string) => void
  dismissToast: (id: string) => void
}

export const useUiStore = create<UiState>()((set, get) => ({
  selectedDate: todayKey(),
  mobileView: 'chat',
  toasts: [],
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setMobileView: (mobileView) => set({ mobileView }),
  pushToast: (text) => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, text }] }))
    window.setTimeout(() => get().dismissToast(id), 5000)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
