import { addDays, toDateKey } from './date'

export type DayPhase = 'dawn' | 'morning' | 'day' | 'dusk' | 'night'

export const PHASE_LABEL: Record<DayPhase, string> = {
  dawn: '새벽',
  morning: '아침',
  day: '낮',
  dusk: '해 질 녘',
  night: '밤',
}

export const getDayPhase = (date: Date): DayPhase => {
  const h = date.getHours()
  if (h >= 5 && h < 7) return 'dawn'
  if (h >= 7 && h < 11) return 'morning'
  if (h >= 11 && h < 17) return 'day'
  if (h >= 17 && h < 19) return 'dusk'
  return 'night'
}

/** 자동 어둡게: 저녁 7시 ~ 아침 7시 */
export const NIGHT_START = 19
export const NIGHT_END = 7

export const isNightHours = (date: Date): boolean => date.getHours() >= NIGHT_START || date.getHours() < NIGHT_END

/** "어느 밤"인지 구분하는 키. 새벽 2시도 전날 저녁에 시작된 밤으로 본다 */
export const nightKey = (date: Date): string => toDateKey(date.getHours() < NIGHT_END ? addDays(date, -1) : date)

/** 데모용: 주소 뒤에 ?hour=21 을 붙이면 그 시각으로 미리 보기 */
const previewHour = (): number | null => {
  const raw = new URLSearchParams(window.location.search).get('hour')
  if (raw === null) return null
  const hour = Number(raw)
  return Number.isInteger(hour) && hour >= 0 && hour < 24 ? hour : null
}

export const readNow = (): Date => {
  const now = new Date()
  const hour = previewHour()
  if (hour !== null) now.setHours(hour, 0, 0, 0)
  return now
}
