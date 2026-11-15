import type { Repeat } from '../types/task'
import { addDays, startOfDay, toDateKey } from './date'

export interface ParsedSchedule {
  /** add: 할 일 추가 / query: 일정 묻기 / diary: 일정이 아닌 하루 이야기 */
  kind: 'add' | 'query' | 'diary'
  title: string
  date: string
  time: string | null
  repeat: Repeat
  weekday: number | null
}

const DAY_INDEX: Record<string, number> = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 }
const RELATIVE: Record<string, number> = { 그저께: -2, 그제: -2, 어제: -1, 오늘: 0, 내일: 1, 낼: 1, 모레: 2, 글피: 3 }

/** 지난 일을 말하는 끝맺음 ("피곤했어", "만났어요", "좋았다") */
const PAST_RE = /(았|었|였|했|웠|됐|났|갔|왔|봤|줬|셨|혔)(어|어요|다|음|네|지|는데|더라|구나)?\s*[.!~ㅠㅜ]*\s*$/
/** 기분을 나타내는 말 */
const FEELING_RE = /(피곤|지치|지쳤|힘들|힘드|졸려|졸리|우울|슬프|슬펐|속상|외로|짜증|화나|화났|행복|기뻐|기뻤|좋았|신나|신났|뿌듯|설레|설렜|재밌|재미있|즐거|불안|걱정|기분)/

/** 문장에 남아도 의미 없는 조사·군더더기 토큰 */
const FILLER = new Set(['에', '에는', '엔', '은', '는', '부터', '까지', '쯤', '정도', '에도', '이날', '그날', '날', '나', '저', '음', '아', '좀', '꼭'])

/** "가야 해" → "가기" 처럼 할 일 말투로 바꿀 때 쓰는 어간 보정 */
const STEM_FIX: Record<string, string> = { 해: '하', 봐: '보', 와: '오', 줘: '주', 써: '쓰', 둬: '두', 가: '가', 사: '사' }

const QUERY_RE = /(뭐|무슨|어떤|몇\s*개)\s*(가|일|일정)?\s*(있|해야|잡혀|남았)|일정\s*(알려|보여|확인)|할\s*일\s*(알려|보여|뭐)/

const toHHmm = (h: number, m: number): string => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`

/** 하루 중 시간대 → 24시간제 보정 */
const resolveHour = (hour: number, period?: string): number => {
  if (period && /오후|저녁|밤/.test(period)) return hour < 12 ? hour + 12 : hour === 12 && period === '밤' ? 0 : hour
  if (period && /오전|새벽|아침/.test(period)) return hour === 12 ? 0 : hour
  // 시간대가 없으면 1~6시는 오후로 본다 ("3시 치과" → 15:00)
  return hour >= 1 && hour <= 6 ? hour + 12 : hour
}

const cleanTitle = (raw: string): string => {
  const tokens = raw
    .replace(/(뭐|무슨\s*일)\s*(해야\s*하는데|있냐면|있는데)/, ' ')
    .replace(/[,.!~]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !FILLER.has(t))
  let title = tokens.join(' ')
  // 끝맺음 정리: "잡혔어", "있어" 등은 제거
  title = title.replace(/\s*(이\s*)?(잡혔어|잡혀\s*있어|있어|있음|있대|예정이야|예정|할\s*거야|할게|하려고)\s*$/, '')
  // "사야 해" → "사기", "운동해야 돼" → "운동하기"
  title = title.replace(/([가-힣])야\s*(해|돼|됨|한다|함|지|겠다)?\s*$/, (_, stem: string) => `${STEM_FIX[stem] ?? stem}기`)
  return title.replace(/(에|에는)$/, '').trim()
}

export const parseKoreanSchedule = (input: string, now = new Date()): ParsedSchedule => {
  let rest = ` ${input.trim()} `
  // 정규식에 맞는 부분을 문장에서 떼어내며 읽는다
  const take = (re: RegExp): RegExpMatchArray | null => {
    const m = rest.match(re)
    if (m) rest = rest.replace(m[0], ' ')
    return m
  }

  const today = startOfDay(now)
  let date: Date | null = null
  let time: string | null = null
  let repeat: Repeat = 'none'
  let weekday: number | null = null

  // 1) 반복
  if (take(/매일|날마다|하루마다/)) repeat = 'daily'
  else if (take(/평일(마다|에는|엔)?/)) repeat = 'weekdays'
  else {
    const w = take(/매주\s*([일월화수목금토])(?:요일|욜)(?:마다|에)?|([일월화수목금토])(?:요일|욜)마다/)
    if (w) {
      repeat = 'weekly'
      weekday = DAY_INDEX[w[1] ?? w[2]]
    }
  }

  // 2) 상대 시간 ("10분 뒤", "2시간 후") — 알림 데모용
  const later = take(/(\d+)\s*(분|시간)\s*(뒤|후)(에)?/)
  if (later) {
    const ms = Number(later[1]) * (later[2] === '분' ? 60_000 : 3_600_000)
    const at = new Date(now.getTime() + ms)
    date = startOfDay(at)
    time = toHHmm(at.getHours(), at.getMinutes())
  }

  // 3) 날짜
  const rel = !date && take(/(그저께|그제|어제|오늘|내일|낼|모레|글피)/)
  if (rel) date = addDays(today, RELATIVE[rel[1]])

  const after = !date && take(/(\d+)\s*일\s*(뒤|후)(에)?/)
  if (after) date = addDays(today, Number(after[1]))

  const md = !date && take(/(\d{1,2})\s*월\s*(\d{1,2})\s*일|(\d{1,2})\/(\d{1,2})/)
  if (md) {
    const month = Number(md[1] ?? md[3])
    const day = Number(md[2] ?? md[4])
    date = new Date(today.getFullYear(), month - 1, day)
    if (date < today) date = new Date(today.getFullYear() + 1, month - 1, day)
  }

  const wk = !date && repeat === 'none' && take(/(다다음\s*주|다음\s*주|담주|이번\s*주)?\s*([일월화수목금토])(?:요일|욜)|주말/)
  if (wk) {
    const target = wk[0].includes('주말') && !wk[2] ? 6 : DAY_INDEX[wk[2]]
    const week = wk[1]?.replace(/\s/g, '')
    if (week) {
      // 월요일 시작 기준 주 계산
      const mondayOffset = (today.getDay() + 6) % 7
      const monday = addDays(today, -mondayOffset)
      const weeks = week === '이번주' ? 0 : week === '다다음주' ? 2 : 1
      date = addDays(monday, weeks * 7 + ((target + 6) % 7))
      // "이번 주 금요일"인데 이미 지났다면 다가오는 금요일로 본다
      if (date < today) date = addDays(date, 7)
    } else {
      date = addDays(today, (target - today.getDay() + 7) % 7)
    }
  }

  // 4) 시각
  if (!time) {
    const t = take(/(오전|오후|아침|점심|저녁|밤|새벽)?\s*(\d{1,2})\s*시\s*(반|(\d{1,2})\s*분)?(에)?/)
    const hm = !t && take(/(\d{1,2}):(\d{2})(에)?/)
    if (t) time = toHHmm(resolveHour(Number(t[2]), t[1]), t[3] === '반' ? 30 : Number(t[4] ?? 0))
    else if (hm) time = toHHmm(Number(hm[1]), Number(hm[2]))
    else {
      const part = take(/(아침|점심|저녁|밤|새벽)(에)?/)
      if (part) time = { 아침: '08:00', 점심: '12:00', 저녁: '19:00', 밤: '21:00', 새벽: '05:00' }[part[1]] ?? null
    }
  }

  if (repeat === 'weekly' && weekday !== null && !date) {
    date = addDays(today, (weekday - today.getDay() + 7) % 7)
  }

  const isQuery = QUERY_RE.test(input) && cleanTitle(rest.replace(QUERY_RE, ' ').replace(/[?？]/g, '')).length <= 2

  // 지난 일이나 기분을 말했고, 앞으로의 날짜·시각·반복이 없으면 할 일이 아니라 일기로 본다.
  // "내일 회의 잡혔어"처럼 미래 날짜가 있으면 과거형이어도 할 일이다.
  const talksPastOrFeeling = PAST_RE.test(input.trim()) || FEELING_RE.test(input)
  const notFuture = !date || date <= today
  const isDiary = !isQuery && talksPastOrFeeling && notFuture && !time && repeat === 'none'

  const kind: ParsedSchedule['kind'] = isQuery ? 'query' : isDiary ? 'diary' : 'add'

  return {
    kind,
    title: kind === 'add' ? cleanTitle(rest.replace(/[?？]/g, '')) : '',
    date: toDateKey(date ?? today),
    time,
    repeat,
    weekday,
  }
}
