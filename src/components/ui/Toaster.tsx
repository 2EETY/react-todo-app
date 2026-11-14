import { BellRing, X } from 'lucide-react'
import { useUiStore } from '../../store/useUiStore'
import { IconButton } from './IconButton'

export const Toaster = () => {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismissToast)

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm animate-rise items-center gap-3 rounded-2xl bg-ink py-2 pr-2 pl-4 text-sm text-paper shadow-lg shadow-night/20 dark:bg-moon dark:text-night"
        >
          <BellRing aria-hidden size={16} className="shrink-0 text-reed" />
          <p className="flex-1">{t.text}</p>
          <IconButton
            label="알림 닫기"
            size="sm"
            icon={<X size={16} />}
            onClick={() => dismiss(t.id)}
            className="text-paper/70 hover:bg-paper/10 hover:text-paper dark:text-night/60 dark:hover:bg-night/10 dark:hover:text-night"
          />
        </div>
      ))}
    </div>
  )
}
