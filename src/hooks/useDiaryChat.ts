import { useState } from 'react'
import { isTaskOnDate } from '../lib/date'
import { replyForAdd, replyForDiary, replyForEmptyTitle, replyForQuery } from '../lib/diaryReply'
import { parseKoreanSchedule } from '../lib/parseKoreanSchedule'
import { useChatStore } from '../store/useChatStore'
import { useTaskStore } from '../store/useTaskStore'
import { useUiStore } from '../store/useUiStore'

const REPLY_DELAY = 650 // 일기장이 "생각하는" 듯한 짧은 텀

/** 채팅 입력 → 파싱 → 일정 추가/조회 → 답장까지의 흐름을 담당 */
export const useDiaryChat = () => {
  const [isTyping, setIsTyping] = useState(false)
  const addMessage = useChatStore((s) => s.addMessage)
  const addTask = useTaskStore((s) => s.addTask)
  const setSelectedDate = useUiStore((s) => s.setSelectedDate)

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return
    addMessage('user', trimmed)
    setIsTyping(true)

    const parsed = parseKoreanSchedule(trimmed)
    const tasks = useTaskStore.getState().tasks
    let reply: string

    if (parsed.kind === 'query') {
      reply = replyForQuery(parsed.date, tasks)
      setSelectedDate(parsed.date)
    } else if (parsed.kind === 'diary') {
      reply = replyForDiary(trimmed)
    } else if (!parsed.title) {
      reply = replyForEmptyTitle()
    } else {
      const sameDay = tasks.filter((t) => isTaskOnDate(t, parsed.date))
      const task = addTask({
        title: parsed.title,
        date: parsed.date,
        time: parsed.time,
        repeat: parsed.repeat,
        weekday: parsed.weekday,
      })
      reply = replyForAdd(task, sameDay)
      // 대화로 추가한 날짜로 일정 패널도 함께 이동 (상태 동기화)
      setSelectedDate(parsed.date)
    }

    window.setTimeout(() => {
      addMessage('diary', reply)
      setIsTyping(false)
    }, REPLY_DELAY)
  }

  return { send, isTyping }
}
