/** none: 한 번만 / daily: 매일 / weekdays: 평일 / weekly: 매주 특정 요일 */
export type Repeat = 'none' | 'daily' | 'weekdays' | 'weekly'

export interface Task {
  id: string
  title: string
  /** YYYY-MM-DD. 루틴은 처음 등록한 날 */
  date: string
  /** HH:mm, 시간이 없으면 null */
  time: string | null
  repeat: Repeat
  /** weekly 루틴의 요일 (0=일 ~ 6=토) */
  weekday: number | null
  /** 한 번짜리 일정의 완료 여부 */
  done: boolean
  /** 루틴은 날짜별로 완료 기록 */
  doneDates: string[]
  createdAt: number
}

export type NewTask = Pick<Task, 'title' | 'date' | 'time' | 'repeat' | 'weekday'>

export interface ChatMessage {
  id: string
  role: 'user' | 'diary'
  text: string
  createdAt: number
}
