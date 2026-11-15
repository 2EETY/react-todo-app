import { Check, X } from 'lucide-react'
import { type FormEvent, type KeyboardEvent, useState } from 'react'
import type { Task } from '../../types/task'
import { IconButton } from '../ui/IconButton'

interface TaskEditFormProps {
  task: Task
  onSave: (patch: Pick<Task, 'title' | 'time'>) => void
  onCancel: () => void
}

/** 할 일 제목과 시각을 그 자리에서 고치는 작은 폼. Enter로 저장, Esc로 취소 */
export const TaskEditForm = ({ task, onSave, onCancel }: TaskEditFormProps) => {
  const [title, setTitle] = useState(task.title)
  const [time, setTime] = useState(task.time ?? '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), time: time || null })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onCancel()
    }
  }

  return (
    <form onSubmit={submit} onKeyDown={onKeyDown} className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-0.5">
      <label className="sr-only" htmlFor={`edit-title-${task.id}`}>
        할 일 제목
      </label>
      <input
        id={`edit-title-${task.id}`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        className="min-w-0 flex-1 basis-32 rounded-lg bg-paper px-2 py-1 text-[15px] ring-1 ring-ink/15 focus:ring-2 focus:ring-tide/60 focus:outline-none dark:bg-night/60 dark:ring-moon/15"
      />
      <label className="sr-only" htmlFor={`edit-time-${task.id}`}>
        시각 (비우면 시간 없음)
      </label>
      <input
        id={`edit-time-${task.id}`}
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-[7.5rem] rounded-lg bg-paper px-2 py-1 text-sm text-tide ring-1 ring-ink/15 focus:ring-2 focus:ring-tide/60 focus:outline-none dark:bg-night/60 dark:ring-moon/15"
      />
      <IconButton type="submit" label="고친 내용 저장" size="sm" icon={<Check size={16} />} disabled={!title.trim()} />
      <IconButton label="고치기 취소" size="sm" icon={<X size={16} />} onClick={onCancel} />
    </form>
  )
}
