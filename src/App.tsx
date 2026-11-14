import clsx from 'clsx'
import { ChatPanel } from './components/chat/ChatPanel'
import { BackgroundScene, ScenePicker } from './components/hero/BackgroundScene'
import { RotatingPrompt } from './components/hero/RotatingPrompt'
import { Header } from './components/layout/Header'
import { SchedulePanel } from './components/schedule/SchedulePanel'
import { Toaster } from './components/ui/Toaster'
import { useCrossTabSync } from './hooks/useCrossTabSync'
import { useReminders } from './hooks/useReminders'
import { useTheme } from './hooks/useTheme'
import { useUiStore } from './store/useUiStore'

const MOBILE_TABS = [
  { id: 'chat', label: '대화' },
  { id: 'schedule', label: '할 일' },
] as const

const App = () => {
  useTheme()
  useReminders()
  useCrossTabSync()
  const mobileView = useUiStore((s) => s.mobileView)
  const setMobileView = useUiStore((s) => s.setMobileView)

  return (
    <>
      <BackgroundScene />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pt-4 pb-4 sm:px-6 sm:pt-6 lg:px-8">
        <Header />
        <RotatingPrompt />

        {/* 모바일에서는 탭으로 한 패널씩, lg 이상에서는 두 패널을 나란히 */}
        <div role="tablist" aria-label="화면 전환" className="mb-3 flex gap-1 self-start rounded-full bg-paper/70 p-1 backdrop-blur lg:hidden dark:bg-dusk/70">
          {MOBILE_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={mobileView === t.id}
              onClick={() => setMobileView(t.id)}
              className={clsx(
                'rounded-full px-4 py-1.5 text-sm transition-colors',
                mobileView === t.id ? 'bg-ink text-paper dark:bg-moon dark:text-night' : 'text-moss dark:text-moon/70',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <main className="grid h-[calc(100dvh-15rem)] min-h-[440px] gap-4 sm:h-[calc(100dvh-17rem)] lg:h-[min(640px,calc(100dvh-21.5rem))] lg:grid-cols-[1.25fr_1fr] lg:gap-5">
          <ChatPanel className={clsx(mobileView !== 'chat' && 'hidden lg:flex')} />
          <SchedulePanel className={clsx(mobileView !== 'schedule' && 'hidden lg:flex')} />
        </main>

        <footer className="mt-4 flex flex-col items-start gap-2 text-xs text-moss sm:flex-row sm:items-center sm:justify-between dark:text-moon/55">
          <ScenePicker />
          <p>모든 기록은 이 브라우저에만 저장돼요.</p>
        </footer>
      </div>
      <Toaster />
    </>
  )
}

export default App
