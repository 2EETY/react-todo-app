import { Eraser } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useDiaryChat } from '../../hooks/useDiaryChat'
import { useChatStore } from '../../store/useChatStore'
import { useUiStore } from '../../store/useUiStore'
import { IconButton } from '../ui/IconButton'
import { Panel } from '../layout/Panel'
import { ChatBubble, TypingDots } from './ChatBubble'
import { ChatInput } from './ChatInput'

interface ChatPanelProps {
  className?: string
}

export const ChatPanel = ({ className }: ChatPanelProps) => {
  const messages = useChatStore((s) => s.messages)
  const clear = useChatStore((s) => s.clear)
  const restore = useChatStore((s) => s.restore)
  const pushToast = useUiStore((s) => s.pushToast)

  const clearWithUndo = () => {
    if (messages.length <= 1) return
    const previous = clear()
    pushToast('대화를 비웠어요.', { label: '되돌리기', onAction: () => restore(previous) })
  }
  const { send, isTyping } = useDiaryChat()
  const listRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 오면 맨 아래로 스크롤 (DOM을 직접 다루는 일이라 effect가 맞다)
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, isTyping])

  return (
    <Panel
      className={className}
      title="일기장과 대화"
      actions={<IconButton label="대화 비우기" size="sm" icon={<Eraser size={16} />} onClick={clearWithUndo} disabled={messages.length <= 1} />}
    >
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <ol className="flex flex-col gap-3" aria-live="polite">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
          {isTyping && <TypingDots />}
        </ol>
      </div>
      <ChatInput onSend={send} disabled={isTyping} />
    </Panel>
  )
}
