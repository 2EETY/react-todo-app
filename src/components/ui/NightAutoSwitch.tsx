import clsx from 'clsx'
import { useSettingsStore } from '../../store/useSettingsStore'

/** 저녁 7시 ~ 아침 7시 자동 어둡게 켜기/끄기 */
export const NightAutoSwitch = () => {
  const on = useSettingsStore((s) => s.nightAutoDark)
  const setOn = useSettingsStore((s) => s.setNightAutoDark)

  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => setOn(!on)} className="group inline-flex items-center gap-2 rounded-full py-1">
      <span
        aria-hidden
        className={clsx(
          'relative h-4 w-7 rounded-full transition-colors',
          on ? 'bg-reed' : 'bg-ink/20 dark:bg-moon/20',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 size-3 rounded-full bg-paper shadow-sm transition-transform dark:bg-moon',
            on && 'translate-x-3',
          )}
        />
      </span>
      밤에는 어둡게 (19시~7시)
    </button>
  )
}
