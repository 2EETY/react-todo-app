import clsx from 'clsx'
import type { ChatMessage } from '../../types/task'

interface ChatBubbleProps {
  message: ChatMessage
}

/** 일기장의 답장은 명조체로, 내가 쓴 말은 고딕체 말풍선으로 구분한다 */
export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const mine = message.role === 'user'
  return (
    <li className={clsx('flex animate-rise', mine ? 'justify-end' : 'justify-start')}>
      <p
        className={clsx(
          'max-w-[85%] whitespace-pre-line sm:max-w-[75%]',
          mine
            ? 'rounded-[18px] rounded-br-md bg-reed/20 px-4 py-2.5 text-[15px] leading-relaxed text-ink dark:bg-reed/25 dark:text-moon'
            : 'px-1 py-1 font-serif text-[16px] leading-[1.85] text-ink dark:text-moon/90',
        )}
      >
        <span className="sr-only">{mine ? '나: ' : '일기장: '}</span>
        {message.text}
      </p>
    </li>
  )
}

export const TypingDots = () => (
  <li className="flex items-center gap-1 px-1 py-2" aria-label="일기장이 답장을 쓰는 중">
    {[0, 1, 2].map((i) => (
      <span key={i} className="size-1.5 animate-bounce rounded-full bg-moss/60 dark:bg-moon/50" style={{ animationDelay: `${i * 120}ms` }} />
    ))}
  </li>
)
