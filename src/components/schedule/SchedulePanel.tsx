import clsx from 'clsx'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { isDoneOn, isTaskOnDate, todayKey } from '../../lib/date'
import { useTaskStore } from '../../store/useTaskStore'
import { useUiStore } from '../../store/useUiStore'
import { Panel } from '../layout/Panel'
import { NotionExportDialog } from '../notion/NotionExportDialog'
import { Button } from '../ui/Button'
import { DateNavigator } from './DateNavigator'
import { SortableTaskList } from './SortableTaskList'

type Tab = 'day' | 'routine'

const EmptyNote = ({ children }: { children: string }) => (
  <p className="px-6 py-10 text-center font-serif text-[15px] leading-relaxed text-moss dark:text-moon/70">{children}</p>
)

interface SchedulePanelProps {
  className?: string
}

export const SchedulePanel = ({ className }: SchedulePanelProps) => {
  const [tab, setTab] = useState<Tab>('day')
  const [exportOpen, setExportOpen] = useState(false)
  const tasks = useTaskStore((s) => s.tasks)
  const selected = useUiStore((s) => s.selectedDate)

  // 파생 상태: 저장하지 않고 렌더링할 때마다 tasks에서 계산한다
  const dayTasks = tasks.filter((t) => isTaskOnDate(t, selected))
  const routines = tasks.filter((t) => t.repeat !== 'none')
  const doneCount = dayTasks.filter((t) => isDoneOn(t, selected)).length

  return (
    <Panel
      className={className}
      title="할 일"
      actions={
        <Button variant="soft" onClick={() => setExportOpen(true)} className="px-3 py-1.5 text-xs" disabled={tasks.length === 0}>
          <Send aria-hidden size={13} />
          Notion으로 보내기
        </Button>
      }
    >
      <div role="tablist" aria-label="보기 방식" className="flex gap-1 px-4 pt-3 sm:px-5">
        {(
          [
            ['day', '날짜별'],
            ['routine', `루틴 ${routines.length || ''}`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={clsx(
              'rounded-full px-3.5 py-1.5 text-sm transition-colors',
              tab === id ? 'bg-ink text-paper dark:bg-moon dark:text-night' : 'text-moss hover:bg-ink/6 dark:text-moon/70 dark:hover:bg-moon/10',
            )}
          >
            {label.trim()}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto pb-3">
        {tab === 'day' ? (
          <>
            <DateNavigator total={dayTasks.length} doneCount={doneCount} />
            <div className="px-2 sm:px-3">
              <SortableTaskList tasks={dayTasks} dateKey={selected} empty={<EmptyNote>이날은 비어 있어요. 대화창에 할 일을 말하면 여기에 적혀요.</EmptyNote>} />
            </div>
          </>
        ) : (
          <div className="px-2 pt-3 sm:px-3">
            <p className="px-3 pb-2 text-xs text-moss dark:text-moon/60">체크는 오늘 기준으로 기록돼요.</p>
            <SortableTaskList tasks={routines} dateKey={todayKey()} empty={<EmptyNote>"매일 아침 7시 스트레칭"처럼 반복할 일을 말하면 여기에 모여요.</EmptyNote>} />
          </div>
        )}
      </div>

      <NotionExportDialog open={exportOpen} onClose={() => setExportOpen(false)} tasks={tasks} />
    </Panel>
  )
}
