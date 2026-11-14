import type { Task } from '../types/task'
import { formatMonthDay, formatTime, isTaskOnDate, relativeWord, repeatLabel } from './date'

const when = (date: string, time: string | null): string => {
  const rel = relativeWord(date)
  const day = rel ? `${rel}(${formatMonthDay(date)})` : formatMonthDay(date)
  return time ? `${day} ${formatTime(time)}` : day
}

/** 마지막 글자의 받침 유무로 조사 선택 (을/를, 은/는) */
const josa = (word: string, withFinal: string, withoutFinal: string): string => {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  if (code < 0 || code > 11171) return `${withFinal}(${withoutFinal})`
  return code % 28 === 0 ? withoutFinal : withFinal
}
const eulReul = (word: string): string => josa(word, '을', '를')

export const replyForAdd = (task: Task, sameDay: Task[]): string => {
  const routine = repeatLabel(task)
  if (routine) {
    const at = task.time ? ` ${formatTime(task.time)}` : ''
    return `${routine}${at}, '${task.title}'${eulReul(task.title)} 루틴에 넣어 뒀어요. 꾸준히 해 봐요.`
  }

  const base = `${when(task.date, task.time)}에 '${task.title}'${eulReul(task.title)} 적어 뒀어요.`
  const clash = task.time ? sameDay.find((t) => t.time === task.time) : undefined
  if (clash) return `${base} 그런데 같은 시간에 '${clash.title}'도 잡혀 있어요. 순서를 한번 살펴봐 주세요.`
  if (sameDay.length > 0) return `${base} 그날은 이것까지 ${sameDay.length + 1}개가 있어요.`
  return base
}

export const replyForQuery = (date: string, tasks: Task[]): string => {
  const list = tasks.filter((t) => isTaskOnDate(t, date))
  const label = relativeWord(date) ?? formatMonthDay(date)
  if (list.length === 0) return `${label}${josa(label, '은', '는')} 아직 비어 있어요. 하고 싶은 일이 생기면 말해 주세요.`

  const lines = [...list]
    .sort((a, b) => (a.time ?? '99').localeCompare(b.time ?? '99'))
    .map((t) => `· ${t.time ? `${formatTime(t.time)} ` : ''}${t.title}`)
  return `${label}에는 ${list.length}개가 있어요.\n${lines.join('\n')}`
}

export const replyForEmptyTitle = (): string =>
  '무엇을 할지 조금만 더 알려 주세요. 예를 들면 "토요일 오전 10시 등산"처럼요.'
