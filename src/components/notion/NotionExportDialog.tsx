import { Copy, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { fakeNotionRequest, toNotionMarkdown } from '../../lib/notionExport'
import { useUiStore } from '../../store/useUiStore'
import type { Task } from '../../types/task'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'
import { NotionSteps, type Step } from './NotionSteps'

interface NotionExportDialogProps {
  open: boolean
  onClose: () => void
  tasks: Task[]
}

export const NotionExportDialog = ({ open, onClose, tasks }: NotionExportDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [step, setStep] = useState<Step>('idle')
  const [database, setDatabase] = useState('하루결 할 일')
  const [sentCount, setSentCount] = useState(0)
  const pushToast = useUiStore((s) => s.pushToast)

  // <dialog>는 showModal()/close()로 열고 닫아야 해서 open 값을 DOM에 맞춰 준다
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const handleClose = () => {
    setStep('idle')
    setSentCount(0)
    onClose()
  }

  const connect = async () => {
    setStep('connecting')
    await fakeNotionRequest(1400)
    setStep('connected')
  }

  const send = async () => {
    setStep('sending')
    // 항목을 하나씩 보내는 것처럼 진행률을 올린다
    for (let i = 1; i <= tasks.length; i++) {
      await fakeNotionRequest(Math.max(120, 900 / tasks.length))
      setSentCount(i)
    }
    setStep('sent')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toNotionMarkdown(tasks))
      pushToast('복사했어요. Notion 페이지에 붙여넣으면 체크리스트로 바뀌어요.')
    } catch {
      pushToast('클립보드에 접근할 수 없어요. 브라우저 권한을 확인해 주세요.')
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      aria-labelledby="notion-title"
      className="m-auto w-[min(92vw,26rem)] rounded-[26px] bg-paper p-0 text-ink shadow-2xl shadow-night/30 dark:bg-dusk dark:text-moon"
    >
      <div className="flex items-start justify-between gap-3 px-6 pt-5">
        <div>
          <h2 id="notion-title" className="font-serif text-xl font-bold">
            Notion으로 보내기
          </h2>
          <p className="mt-1 text-sm text-moss dark:text-moon/65">할 일 {tasks.length}개를 Notion 데이터베이스로 옮겨요.</p>
        </div>
        <IconButton label="닫기" size="sm" icon={<X size={18} />} onClick={handleClose} />
      </div>

      <div className="px-6 py-5">
        <NotionSteps
          step={step}
          database={database}
          onDatabaseChange={setDatabase}
          sentCount={sentCount}
          total={tasks.length}
          onConnect={connect}
          onSend={send}
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-ink/8 bg-ink/3 px-6 py-4 dark:border-moon/8 dark:bg-night/30">
        <p className="text-xs leading-snug text-moss dark:text-moon/55">연결이 어렵다면 복사해서 Notion에 붙여넣어도 돼요.</p>
        <Button variant="ghost" onClick={copy} className="shrink-0 px-3 py-1.5 text-xs ring-1 ring-ink/12 dark:ring-moon/15">
          <Copy aria-hidden size={13} />
          마크다운 복사
        </Button>
      </div>
    </dialog>
  )
}
