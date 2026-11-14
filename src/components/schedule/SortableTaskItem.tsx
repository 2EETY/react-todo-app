import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { Check, GripVertical, Repeat2, Trash2 } from 'lucide-react'
import { formatTime, isDoneOn, repeatLabel } from '../../lib/date'
import { useTaskStore } from '../../store/useTaskStore'
import type { Task } from '../../types/task'
import { IconButton } from '../ui/IconButton'

interface SortableTaskItemProps {
  task: Task
  dateKey: string
}

export const SortableTaskItem = ({ task, dateKey }: SortableTaskItemProps) => {
  const toggleTask = useTaskStore((s) => s.toggleTask)
  const removeTask = useTaskStore((s) => s.removeTask)
  // useSortable: 이 항목을 드래그 가능한 정렬 요소로 등록하고 위치 변화(transform)를 돌려준다
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const done = isDoneOn(task, dateKey)
  const routine = repeatLabel(task)

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        'group relative flex items-center gap-1 rounded-2xl py-1.5 pr-1.5 pl-0.5',
        isDragging ? 'z-10 bg-paper shadow-lg shadow-night/10 ring-1 ring-reed/40 dark:bg-dusk' : 'hover:bg-ink/4 dark:hover:bg-moon/5',
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={`'${task.title}' 순서 옮기기`}
        className="flex h-9 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-moss/45 hover:text-reed-deep active:cursor-grabbing dark:text-moon/30 dark:hover:text-reed"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`'${task.title}' ${done ? '완료 취소' : '완료'}`}
        onClick={() => toggleTask(task.id, dateKey)}
        className={clsx(
          'mr-2 flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors',
          done ? 'border-reed bg-reed text-paper' : 'border-moss/40 hover:border-reed dark:border-moon/35',
        )}
      >
        {done && <Check size={13} strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={clsx('truncate text-[15px] transition-colors', done && 'text-moss/55 line-through decoration-reed/60 dark:text-moon/40')}>
          {task.title}
        </p>
        {(task.time || routine) && (
          <p className="mt-0.5 flex items-center gap-2 text-xs text-tide dark:text-tide/90">
            {task.time && <time dateTime={task.time}>{formatTime(task.time)}</time>}
            {routine && (
              <span className="inline-flex items-center gap-0.5 text-reed-deep dark:text-reed">
                <Repeat2 aria-hidden size={12} />
                {routine}
              </span>
            )}
          </p>
        )}
      </div>

      <IconButton
        label={`'${task.title}' 지우기`}
        size="sm"
        icon={<Trash2 size={15} />}
        onClick={() => removeTask(task.id)}
        className="opacity-100 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      />
    </li>
  )
}
