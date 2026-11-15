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
  const topic = relativeWord(date) ? `${label}${josa(label, '은', '는')}` : `${label}에는`
  return `${topic} ${list.length}개가 있어요.\n${lines.join('\n')}`
}

/** 일정이 아닌 하루 이야기에는 할 일을 만들지 않고 공감만 한다 */
const DIARY_REPLIES: { match: RegExp; reply: string }[] = [
  { match: /피곤|지치|지쳤|힘들|힘드|졸려|졸리/, reply: '오늘 많이 지쳤군요. 남은 일은 내일의 나에게 맡기고 푹 쉬어요.' },
  { match: /우울|슬프|슬펐|속상|외로|짜증|화나|화났|불안|걱정/, reply: '마음이 무거운 하루였군요. 여기 적어 둔 것만으로도 조금 가벼워졌으면 해요.' },
  { match: /행복|기뻐|기뻤|좋았|신나|신났|뿌듯|설레|설렜|재밌|재미있|즐거/, reply: '좋은 하루였네요. 그 기분, 오래 기억해 둘게요.' },
]

export const replyForDiary = (text: string): string =>
  DIARY_REPLIES.find((d) => d.match.test(text))?.reply ??
  '들려줘서 고마워요. 오늘 이야기는 여기 남겨 둘게요. 할 일이 생기면 날짜와 함께 말해 주세요.'

export const replyForEmptyTitle = (): string =>
  '무엇을 할지 조금만 더 알려 주세요. 예를 들면 "토요일 오전 10시 등산"처럼요.'
