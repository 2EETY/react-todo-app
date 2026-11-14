import { NotifyToggle } from '../ui/NotifyToggle'
import { ThemeToggle } from '../ui/ThemeToggle'

export const Header = () => (
  <header className="flex items-center justify-between">
    <a href="/" className="flex items-baseline gap-2 rounded-lg">
      <span className="font-serif text-xl font-bold tracking-tight">하루결</span>
      <span className="hidden text-xs text-moss sm:inline dark:text-moon/60">말로 적는 일정 일기장</span>
    </a>
    <nav aria-label="설정" className="flex items-center gap-0.5">
      <NotifyToggle />
      <ThemeToggle />
    </nav>
  </header>
)
