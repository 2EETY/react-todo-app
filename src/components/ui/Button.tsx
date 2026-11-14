import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'soft' | 'ghost'
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-ink text-paper hover:bg-moss dark:bg-moon dark:text-night dark:hover:bg-white',
  soft: 'bg-reed/15 text-reed-deep hover:bg-reed/25 dark:bg-reed/20 dark:text-reed',
  ghost: 'text-moss hover:bg-ink/6 dark:text-moon/75 dark:hover:bg-moon/10',
}

export const Button = ({ variant = 'primary', type = 'button', className, ...rest }: ButtonProps) => (
  <button
    type={type}
    className={clsx(
      'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
      'disabled:pointer-events-none disabled:opacity-45',
      VARIANTS[variant],
      className,
    )}
    {...rest}
  />
)
