import { useEffect } from 'react'
import { useSettingsStore } from '../store/useSettingsStore'

/** 저장된 테마를 <html class="dark">에 반영. 'system'이면 OS 설정 변화도 따라간다. */
export const useTheme = () => {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])
}
