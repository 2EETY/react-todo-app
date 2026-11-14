import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays, formatMonthDay, fromDateKey, relativeWord, toDateKey, todayKey } from '../../lib/date'
import { useUiStore } from '../../store/useUiStore'
import { IconButton } from '../ui/IconButton'

interface DateNavigatorProps {
  total: number
  doneCount: number
}

export const DateNavigator = ({ total, doneCount }: DateNavigatorProps) => {
  const selected = useUiStore((s) => s.selectedDate)
  const setSelected = useUiStore((s) => s.setSelectedDate)
  const shift = (n: number) => setSelected(toDateKey(addDays(fromDateKey(selected), n)))
  const rel = relativeWord(selected)
  const isToday = selected === todayKey()

  return (
    <div className="flex items-center gap-1 px-3 pt-3 pb-2 sm:px-4">
      <IconButton label="이전 날" size="sm" icon={<ChevronLeft size={18} />} onClick={() => shift(-1)} />
      <div className="min-w-0 flex-1 text-center">
        <p className="font-serif text-lg leading-tight font-bold">{rel ?? formatMonthDay(selected)}</p>
        <p className="mt-0.5 text-xs text-moss dark:text-moon/60">
          {rel && <span>{formatMonthDay(selected)}, </span>}
          {total === 0 ? '비어 있음' : `${total}개 중 ${doneCount}개 끝냄`}
          {!isToday && (
            <button type="button" onClick={() => setSelected(todayKey())} className="ml-2 text-tide underline-offset-2 hover:underline">
              오늘로 가기
            </button>
          )}
        </p>
      </div>
      <IconButton label="다음 날" size="sm" icon={<ChevronRight size={18} />} onClick={() => shift(1)} />
    </div>
  )
}
