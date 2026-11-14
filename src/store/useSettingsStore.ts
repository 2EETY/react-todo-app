import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

interface SettingsState {
  theme: ThemeMode
  /** 브라우저 알림 사용 여부 (앱 안 토스트는 항상 표시) */
  browserNotify: boolean
  sceneIndex: number
  setTheme: (theme: ThemeMode) => void
  setBrowserNotify: (on: boolean) => void
  setSceneIndex: (index: number) => void
}

export const SETTINGS_STORAGE_KEY = 'harugyeol:settings'

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      browserNotify: false,
      sceneIndex: 0,
      setTheme: (theme) => set({ theme }),
      setBrowserNotify: (browserNotify) => set({ browserNotify }),
      setSceneIndex: (sceneIndex) => set({ sceneIndex }),
    }),
    { name: SETTINGS_STORAGE_KEY, storage: createJSONStorage(() => localStorage) },
  ),
)
