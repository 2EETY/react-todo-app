import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { ReactNode } from 'react'
import { useTaskStore } from '../../store/useTaskStore'
import type { Task } from '../../types/task'
import { SortableTaskItem } from './SortableTaskItem'

interface SortableTaskListProps {
  tasks: Task[]
  dateKey: string
  empty: ReactNode
}

const SCREEN_READER = {
  draggable: '스페이스바로 집고, 위아래 방향키로 옮긴 뒤 스페이스바로 내려놓으세요. ESC로 취소할 수 있어요.',
}

/** 일정·루틴 탭이 함께 쓰는 드래그 정렬 목록 */
export const SortableTaskList = ({ tasks, dateKey, empty }: SortableTaskListProps) => {
  const moveTask = useTaskStore((s) => s.moveTask)
  // 센서: 마우스는 4px 움직여야, 터치는 살짝 길게 눌러야 드래그 시작 → 클릭·스크롤과 헷갈리지 않게
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) moveTask(String(active.id), String(over.id))
  }

  if (tasks.length === 0) return <>{empty}</>

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} accessibility={{ screenReaderInstructions: SCREEN_READER }}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-0.5">
          {tasks.map((t) => (
            <SortableTaskItem key={t.id} task={t} dateKey={dateKey} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
