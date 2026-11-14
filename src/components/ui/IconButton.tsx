import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 화면 낭독기용 이름 (아이콘만 있는 버튼이라 필수) */
  label: string
  icon: ReactNode
  size?: 'sm' | 'md'
}

export const IconButton = ({ label, icon, size = 'md', className, ...rest }: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={clsx(
      'inline-flex shrink-0 items-center justify-center rounded-full text-moss transition-colors',
      'hover:bg-ink/8 hover:text-ink dark:text-moon/70 dark:hover:bg-moon/10 dark:hover:text-moon',
      'disabled:pointer-events-none disabled:opacity-40',
      size === 'md' ? 'size-10' : 'size-8',
      className,
    )}
    {...rest}
  >
    {icon}
  </button>
)
