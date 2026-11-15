import { create } from 'zustand'
import { todayKey } from '../lib/date'
import { readNow } from '../lib/dayPhase'

export interface ToastAction {
  label: string
  onAction: () => void
}

export interface Toast {
  id: string
  text: string
  action?: ToastAction
}

/** 저장하지 않는 화면 상태 (새로고침하면 초기화) */
interface UiState {
  /** 앱 전체가 함께 보는 현재 시각. useClock이 1분마다 갱신한다 */
  now: Date
  selectedDate: string
  mobileView: 'chat' | 'schedule'
  toasts: Toast[]
  /** 방금 대화로 추가된 할 일 (잠깐 강조 표시) */
  lastAddedId: string | null
  /** 모바일에서 '대화' 탭에 있는 동안 추가된 할 일 개수 → '할 일' 탭 배지 */
  unseenCount: number
  markAdded: (id: string) => void
  tick: () => void
  setSelectedDate: (key: string) => void
  setMobileView: (view: UiState['mobileView']) => void
  /** action을 주면 '되돌리기' 같은 버튼이 달린다 (조금 더 오래 보여 준다) */
  pushToast: (text: string, action?: ToastAction) => void
  dismissToast: (id: string) => void
}

export const useUiStore = create<UiState>()((set, get) => ({
  now: readNow(),
  selectedDate: todayKey(),
  mobileView: 'chat',
  toasts: [],
  lastAddedId: null,
  unseenCount: 0,
  markAdded: (id) => {
    set((s) => ({ lastAddedId: id, unseenCount: s.mobileView === 'chat' ? s.unseenCount + 1 : 0 }))
    window.setTimeout(() => {
      if (get().lastAddedId === id) set({ lastAddedId: null })
    }, 3000)
  },
  tick: () => set({ now: readNow() }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setMobileView: (mobileView) => set((s) => ({ mobileView, unseenCount: mobileView === 'schedule' ? 0 : s.unseenCount })),
  pushToast: (text, action) => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, text, action }] }))
    window.setTimeout(() => get().dismissToast(id), action ? 7000 : 5000)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
