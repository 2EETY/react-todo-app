import { useCallback, useEffect } from 'react'
import { formatTime, isDoneOn, isTaskOnDate, toDateKey } from '../lib/date'
import { useSettingsStore } from '../store/useSettingsStore'
import { useTaskStore } from '../store/useTaskStore'
import { useUiStore } from '../store/useUiStore'
import { useInterval } from './useInterval'

const WINDOW_MIN = 10 // 정각을 놓쳐도 10분 안이면 알려준다

export const useReminders = () => {
  const browserNotify = useSettingsStore((s) => s.browserNotify)
  const pushToast = useUiStore((s) => s.pushToast)

  const check = useCallback(() => {
    // 렌더링과 무관한 주기 작업이라 getState()로 최신 값을 직접 읽는다
    const { tasks, notified, markNotified } = useTaskStore.getState()
    const now = new Date()
    const key = toDateKey(now)
    const nowMin = now.getHours() * 60 + now.getMinutes()

    tasks.forEach((task) => {
      if (!task.time || !isTaskOnDate(task, key) || isDoneOn(task, key)) return
      const [h, m] = task.time.split(':').map(Number)
      const late = nowMin - (h * 60 + m)
      const noteKey = `${task.id}@${key}`
      if (late < 0 || late > WINDOW_MIN || notified.includes(noteKey)) return

      markNotified(noteKey)
      const body = `${formatTime(task.time)} · ${task.title}`
      pushToast(`지금 할 시간이에요. ${body}`)
      if (browserNotify && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('하루결', { body })
      }
    })
  }, [browserNotify, pushToast])

  useInterval(check, 15_000)
  useEffect(check, [check])
}
