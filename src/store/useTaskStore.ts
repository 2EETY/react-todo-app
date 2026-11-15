import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { NewTask, Task } from '../types/task'

interface TaskState {
  tasks: Task[]
  /** 이미 알림을 보낸 `${taskId}@${date}` 키 목록 */
  notified: string[]
  addTask: (input: NewTask) => Task
  toggleTask: (id: string, dateKey: string) => void
  /** 지운 할 일과 원래 위치를 돌려준다 (되돌리기용) */
  removeTask: (id: string) => { task: Task; index: number } | null
  restoreTask: (task: Task, index: number) => void
  updateTask: (id: string, patch: Partial<Pick<Task, 'title' | 'time'>>) => void
  moveTask: (activeId: string, overId: string) => void
  markNotified: (key: string) => void
}

export const TASK_STORAGE_KEY = 'harugyeol:tasks'

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      notified: [],
      addTask: (input) => {
        const task: Task = { ...input, id: crypto.randomUUID(), done: false, doneDates: [], createdAt: Date.now() }
        set((s) => ({ tasks: [...s.tasks, task] }))
        return task
      },
      toggleTask: (id, dateKey) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== id) return t
            if (t.repeat === 'none') return { ...t, done: !t.done }
            const doneDates = t.doneDates.includes(dateKey)
              ? t.doneDates.filter((d) => d !== dateKey)
              : [...t.doneDates, dateKey]
            return { ...t, doneDates }
          }),
        })),
      removeTask: (id) => {
        const index = get().tasks.findIndex((t) => t.id === id)
        if (index < 0) return null
        const task = get().tasks[index]
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
        return { task, index }
      },
      restoreTask: (task, index) =>
        set((s) => {
          if (s.tasks.some((t) => t.id === task.id)) return {}
          const tasks = [...s.tasks]
          tasks.splice(Math.min(index, tasks.length), 0, task)
          return { tasks }
        }),
      updateTask: (id, patch) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      // 화면에는 필터된 목록만 보이지만, 전체 배열에서 위치를 옮겨도 상대 순서는 유지된다
      moveTask: (activeId, overId) =>
        set((s) => {
          const from = s.tasks.findIndex((t) => t.id === activeId)
          const to = s.tasks.findIndex((t) => t.id === overId)
          if (from < 0 || to < 0 || from === to) return {}
          return { tasks: arrayMove(s.tasks, from, to) }
        }),
      markNotified: (key) => set((s) => ({ notified: [...s.notified.slice(-200), key] })),
    }),
    { name: TASK_STORAGE_KEY, storage: createJSONStorage(() => localStorage) },
  ),
)
