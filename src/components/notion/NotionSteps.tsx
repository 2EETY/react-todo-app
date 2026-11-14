import clsx from 'clsx'
import { CircleCheck, Link2, LoaderCircle } from 'lucide-react'
import { Button } from '../ui/Button'

export type Step = 'idle' | 'connecting' | 'connected' | 'sending' | 'sent'

const DATABASES = ['하루결 할 일', '주간 계획']

interface NotionStepsProps {
  step: Step
  database: string
  onDatabaseChange: (name: string) => void
  sentCount: number
  total: number
  onConnect: () => void
  onSend: () => void
}

/** 연결 → 데이터베이스 선택 → 전송 → 완료 흐름 (실제 API 대신 흉내만 낸다) */
export const NotionSteps = ({ step, database, onDatabaseChange, sentCount, total, onConnect, onSend }: NotionStepsProps) => {
  if (step === 'idle') {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">
          워크스페이스를 연결하면 날짜, 시간, 완료 여부가 그대로 옮겨져요.
          <span className="mt-1 block text-xs text-moss dark:text-moon/55">포트폴리오 데모라 실제 계정에는 연결되지 않아요.</span>
        </p>
        <Button onClick={onConnect} className="w-full">
          <Link2 aria-hidden size={15} />
          Notion 연결하기
        </Button>
      </div>
    )
  }

  if (step === 'connecting') {
    return (
      <p role="status" className="flex items-center justify-center gap-2 py-6 text-sm text-moss dark:text-moon/70">
        <LoaderCircle aria-hidden size={18} className="animate-spin text-tide" />
        워크스페이스에 연결하는 중이에요
      </p>
    )
  }

  if (step === 'connected') {
    return (
      <fieldset className="space-y-3">
        <legend className="mb-3 flex items-center gap-1.5 text-sm text-tide">
          <CircleCheck aria-hidden size={16} />
          연결됐어요. 어디로 보낼까요?
        </legend>
        {DATABASES.map((name) => (
          <label
            key={name}
            className={clsx(
              'flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm ring-1 transition-colors',
              database === name ? 'bg-reed/12 ring-reed/60' : 'ring-ink/10 hover:ring-ink/25 dark:ring-moon/12',
            )}
          >
            <input type="radio" name="notion-db" value={name} checked={database === name} onChange={() => onDatabaseChange(name)} className="accent-reed" />
            {name}
          </label>
        ))}
        <Button onClick={onSend} className="mt-2 w-full">
          {total}개 보내기
        </Button>
      </fieldset>
    )
  }

  const percent = total ? Math.round((sentCount / total) * 100) : 100
  return (
    <div role="status" className="space-y-3 py-2">
      <div className="h-1.5 overflow-hidden rounded-full bg-ink/8 dark:bg-moon/10">
        <div className="h-full rounded-full bg-reed transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
      {step === 'sending' ? (
        <p className="text-sm text-moss dark:text-moon/70">
          '{database}'에 보내는 중이에요 ({sentCount}/{total})
        </p>
      ) : (
        <p className="flex items-center gap-1.5 text-sm">
          <CircleCheck aria-hidden size={16} className="text-reed" />'{database}'에 {total}개를 보냈어요.
        </p>
      )}
    </div>
  )
}
