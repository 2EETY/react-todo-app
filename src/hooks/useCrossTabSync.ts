import { useEffect } from 'react'
import { CHAT_STORAGE_KEY, useChatStore } from '../store/useChatStore'
import { SETTINGS_STORAGE_KEY, useSettingsStore } from '../store/useSettingsStore'
import { TASK_STORAGE_KEY, useTaskStore } from '../store/useTaskStore'

/**
 * 다른 탭에서 localStorage가 바뀌면 'storage' 이벤트가 온다.
 * 그때 저장소를 다시 읽어(rehydrate) 모든 탭의 화면을 같은 상태로 맞춘다.
 */
export const useCrossTabSync = () => {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === TASK_STORAGE_KEY) void useTaskStore.persist.rehydrate()
      if (e.key === CHAT_STORAGE_KEY) void useChatStore.persist.rehydrate()
      if (e.key === SETTINGS_STORAGE_KEY) void useSettingsStore.persist.rehydrate()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
}
