import { useState } from 'react'
import { useInterval } from '../../hooks/useInterval'
import { formatFullDate } from '../../lib/date'
import { getDayPhase, PHASE_LABEL } from '../../lib/dayPhase'
import { useUiStore } from '../../store/useUiStore'

const PROMPTS = [
  '오늘의 기분은 어떤가요?',
  '무슨 일 있었나요?',
  '어떤 일이 예정되어 있나요?',
  '내일의 나에게 남길 말이 있나요?',
  '오늘 가장 미루고 싶은 일은 뭔가요?',
  '이번 주말엔 어디를 걷고 싶나요?',
  '잠들기 전에 꼭 할 일이 있나요?',
]

const ROTATE_MS = 5000

export const RotatingPrompt = () => {
  const [index, setIndex] = useState(0)
  const now = useUiStore((s) => s.now)
  useInterval(() => setIndex((i) => (i + 1) % PROMPTS.length), ROTATE_MS)

  return (
    <section aria-label="오늘의 질문" className="pt-4 pb-4 sm:pt-12 sm:pb-10 lg:pt-16">
      <p className="mb-1.5 font-serif text-[13px] text-moss sm:mb-3 sm:text-base dark:text-moon/75">
        <time dateTime={now.toISOString()}>{formatFullDate(now)}</time>, {PHASE_LABEL[getDayPhase(now)]}
      </p>
      {/* key가 바뀌면 요소가 새로 만들어지며 등장 애니메이션이 다시 재생된다 */}
      <h1
        key={index}
        className="min-h-[2.5em] animate-prompt-in font-serif text-[1.625rem] leading-tight font-bold tracking-[-0.01em] text-ink sm:min-h-[1.3em] sm:text-5xl lg:text-[3.75rem] dark:text-moon"
      >
        {PROMPTS[index]}
      </h1>
    </section>
  )
}
