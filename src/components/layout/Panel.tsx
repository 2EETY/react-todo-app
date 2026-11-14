import clsx from 'clsx'
import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/** 반투명 종이 같은 패널. 대화·일정 두 영역이 같은 틀을 재사용한다 */
export const Panel = ({ title, actions, children, className }: PanelProps) => (
  <section
    aria-label={title}
    className={clsx(
      'flex min-h-0 flex-col overflow-hidden rounded-[26px] bg-paper/78 ring-1 ring-ink/6 backdrop-blur-xl',
      'dark:bg-dusk/80 dark:ring-moon/8',
      className,
    )}
  >
    <header className="flex items-center justify-between gap-2 border-b border-ink/8 py-2.5 pr-3 pl-5 sm:pl-6 dark:border-moon/8">
      <h2 className="font-serif text-[17px] font-bold">{title}</h2>
      <div className="flex items-center gap-1">{actions}</div>
    </header>
    {children}
  </section>
)
