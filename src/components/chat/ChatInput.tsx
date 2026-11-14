import { ArrowUp } from 'lucide-react'
import { type FormEvent, useState } from 'react'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

const SUGGESTIONS = ['내일 오후 3시에 치과 가야 해', '매일 아침 7시 스트레칭', '1분 뒤 물 마시기', '내일 뭐 있어?']

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [text, setText] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <div className="border-t border-ink/8 px-3 pt-3 pb-3 sm:px-4 dark:border-moon/8">
      <ul className="-mx-1 mb-2.5 flex gap-1.5 overflow-x-auto px-1 pb-1" aria-label="이렇게 말해 보세요">
        {SUGGESTIONS.map((s) => (
          <li key={s} className="shrink-0">
            <button
              type="button"
              onClick={() => onSend(s)}
              disabled={disabled}
              className="rounded-full border border-ink/12 px-3 py-1 text-xs text-moss transition-colors hover:border-tide/50 hover:text-tide disabled:opacity-40 dark:border-moon/15 dark:text-moon/70 dark:hover:text-moon"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="flex items-center gap-2 rounded-full bg-paper py-1.5 pr-1.5 pl-4 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-tide/60 dark:bg-night/60 dark:ring-moon/12">
        <label htmlFor="chat-input" className="sr-only">
          일기장에 할 말
        </label>
        <input
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="오늘은 어땠나요? 할 일을 적어 보세요"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-moss/60 focus:outline-none dark:placeholder:text-moon/40"
        />
        <button
          type="submit"
          aria-label="보내기"
          disabled={disabled || !text.trim()}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-opacity disabled:opacity-30 dark:bg-moon dark:text-night"
        >
          <ArrowUp size={18} strokeWidth={2.2} />
        </button>
      </form>
    </div>
  )
}
