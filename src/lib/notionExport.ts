import type { Task } from '../types/task'
import { formatMonthDay, formatTime, repeatLabel } from './date'

/**
 * Notion에 붙여넣으면 체크박스 블록으로 바뀌는 마크다운을 만든다.
 * (Notion 공식 API는 브라우저에서 직접 호출할 수 없어 클립보드 방식을 쓴다)
 */
export const toNotionMarkdown = (tasks: Task[]): string => {
  const oneOff = tasks.filter((t) => t.repeat === 'none').sort((a, b) => (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? '')))
  const routines = tasks.filter((t) => t.repeat !== 'none')

  const lines: string[] = ['# 하루결 — 할 일', '']
  let lastDate = ''
  oneOff.forEach((t) => {
    if (t.date !== lastDate) {
      lines.push('', `## ${formatMonthDay(t.date)}`)
      lastDate = t.date
    }
    lines.push(`- [${t.done ? 'x' : ' '}] ${t.time ? `${formatTime(t.time)} ` : ''}${t.title}`)
  })
  if (routines.length) {
    lines.push('', '## 루틴')
    routines.forEach((t) => lines.push(`- [ ] ${repeatLabel(t)}${t.time ? ` ${formatTime(t.time)}` : ''} · ${t.title}`))
  }
  return lines.join('\n').trim()
}

/** 실제 전송 대신 네트워크 지연을 흉내 낸다 (포트폴리오 데모용) */
export const fakeNotionRequest = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms))
