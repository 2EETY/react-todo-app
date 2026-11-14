import type { Task } from '../types/task'

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

const DAY_MS = 86_400_000

export const toDateKey = (d: Date): string => {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export const fromDateKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const addDays = (d: Date, n: number): Date => {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

export const todayKey = (): string => toDateKey(new Date())

/** 오늘 기준 며칠 차이인지 (내일 = 1) */
export const diffFromToday = (key: string, now = new Date()): number =>
  Math.round((fromDateKey(key).getTime() - startOfDay(now).getTime()) / DAY_MS)

export const relativeWord = (key: string): string | null =>
  ({ '-1': '어제', '0': '오늘', '1': '내일', '2': '모레' } as Record<string, string>)[String(diffFromToday(key))] ?? null

export const formatMonthDay = (key: string): string => {
  const d = fromDateKey(key)
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일`
}

/** "15:00" → "오후 3:00" */
export const formatTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? '오전' : '오후'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${period} ${hour12}:${String(m).padStart(2, '0')}`
}

export const repeatLabel = (task: Pick<Task, 'repeat' | 'weekday'>): string | null => {
  switch (task.repeat) {
    case 'daily':
      return '매일'
    case 'weekdays':
      return '평일마다'
    case 'weekly':
      return `매주 ${WEEKDAYS[task.weekday ?? 0]}요일`
    default:
      return null
  }
}

/** 해당 날짜에 보여야 하는 일정인지 (루틴 포함) */
export const isTaskOnDate = (task: Task, key: string): boolean => {
  if (task.repeat === 'none') return task.date === key
  if (key < task.date) return false
  const day = fromDateKey(key).getDay()
  if (task.repeat === 'daily') return true
  if (task.repeat === 'weekdays') return day >= 1 && day <= 5
  return day === task.weekday
}

export const isDoneOn = (task: Task, key: string): boolean =>
  task.repeat === 'none' ? task.done : task.doneDates.includes(key)
