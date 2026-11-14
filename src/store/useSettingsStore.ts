import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

interface SettingsState {
  theme: ThemeMode
  /** 저녁 7시 ~ 아침 7시에는 설정과 상관없이 어둡게 */
  nightAutoDark: boolean
  /** 사용자가 "오늘 밤은 내 설정대로"를 고른 밤의 키 (nightKey) */
  nightOverride: string | null
  /** 브라우저 알림 사용 여부 (앱 안 토스트는 항상 표시) */
  browserNotify: boolean
  sceneIndex: number
  setTheme: (theme: ThemeMode) => void
  setNightAutoDark: (on: boolean) => void
  setNightOverride: (key: string | null) => void
  setBrowserNotify: (on: boolean) => void
  setSceneIndex: (index: number) => void
}

export const SETTINGS_STORAGE_KEY = 'harugyeol:settings'

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      nightAutoDark: true,
      nightOverride: null,
      browserNotify: false,
      sceneIndex: 0,
      setTheme: (theme) => set({ theme }),
      setNightAutoDark: (nightAutoDark) => set({ nightAutoDark, nightOverride: null }),
      setNightOverride: (nightOverride) => set({ nightOverride }),
      setBrowserNotify: (browserNotify) => set({ browserNotify }),
      setSceneIndex: (sceneIndex) => set({ sceneIndex }),
    }),
    { name: SETTINGS_STORAGE_KEY, storage: createJSONStorage(() => localStorage) },
  ),
)
