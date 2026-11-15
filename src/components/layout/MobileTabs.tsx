import clsx from 'clsx'
import { useUiStore } from '../../store/useUiStore'

const TABS = [
  { id: 'chat', label: '대화' },
  { id: 'schedule', label: '할 일' },
] as const

/** 모바일 전용 대화/할 일 전환 탭. 대화 중 추가된 할 일 개수를 배지로 알려 준다 */
export const MobileTabs = () => {
  const view = useUiStore((s) => s.mobileView)
  const setView = useUiStore((s) => s.setMobileView)
  const unseen = useUiStore((s) => s.unseenCount)

  return (
    <div role="tablist" aria-label="화면 전환" className="mb-3 flex gap-1 self-start rounded-full bg-paper/70 p-1 backdrop-blur lg:hidden dark:bg-dusk/70">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={view === t.id}
          onClick={() => setView(t.id)}
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition-colors',
            view === t.id ? 'bg-ink text-paper dark:bg-moon dark:text-night' : 'text-moss dark:text-moon/75',
          )}
        >
          {t.label}
          {t.id === 'schedule' && unseen > 0 && (
            <span className="min-w-[1.25rem] rounded-full bg-reed px-1.5 text-center text-[11px] leading-5 font-semibold text-paper dark:text-night">
              <span className="sr-only">새로 추가됨 </span>
              {unseen}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
