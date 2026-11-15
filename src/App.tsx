import clsx from 'clsx'
import { ChatPanel } from './components/chat/ChatPanel'
import { BackgroundScene, ScenePicker } from './components/hero/BackgroundScene'
import { RotatingPrompt } from './components/hero/RotatingPrompt'
import { Header } from './components/layout/Header'
import { MobileTabs } from './components/layout/MobileTabs'
import { SchedulePanel } from './components/schedule/SchedulePanel'
import { NightAutoSwitch } from './components/ui/NightAutoSwitch'
import { Toaster } from './components/ui/Toaster'
import { useClock } from './hooks/useClock'
import { useCrossTabSync } from './hooks/useCrossTabSync'
import { useReminders } from './hooks/useReminders'
import { useTheme } from './hooks/useTheme'
import { useUiStore } from './store/useUiStore'

const App = () => {
  useClock()
  useTheme()
  useReminders()
  useCrossTabSync()
  const mobileView = useUiStore((s) => s.mobileView)

  return (
    <>
      <BackgroundScene />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        {/*
          모바일: 머리말~입력창까지를 화면 높이(dvh) 하나에 담아 입력창이 잘리지 않게 한다.
          푸터는 그 아래로 스크롤해서 본다. lg 이상은 패널 높이를 고정해 푸터까지 한 화면에 보인다.
        */}
        <div className="flex h-dvh min-h-140 flex-col pt-3 pb-3 sm:pt-6 lg:h-auto lg:min-h-0 lg:pb-0">
          <Header />
          <RotatingPrompt />
          <MobileTabs />

          <main className="grid min-h-0 flex-1 gap-4 lg:h-[min(640px,calc(100dvh-21.5rem))] lg:flex-none lg:grid-cols-[1.25fr_1fr] lg:gap-5">
            <ChatPanel className={clsx(mobileView !== 'chat' && 'hidden lg:flex')} />
            <SchedulePanel className={clsx(mobileView !== 'schedule' && 'hidden lg:flex')} />
          </main>
        </div>

        <footer className="mt-1 mb-4 flex flex-col items-start gap-2 text-xs text-moss sm:flex-row sm:items-center sm:justify-between lg:mt-4 dark:text-moon/65">
          <ScenePicker />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <NightAutoSwitch />
            <p>모든 기록은 이 브라우저에만 저장돼요.</p>
          </div>
        </footer>
      </div>
      <Toaster />
    </>
  )
}

export default App
