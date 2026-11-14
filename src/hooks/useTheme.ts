import { useEffect, useRef } from 'react'
import { isNightHours, nightKey } from '../lib/dayPhase'
import { useSettingsStore } from '../store/useSettingsStore'
import { useUiStore } from '../store/useUiStore'

/** 지금 "밤이라 자동으로 어둡게" 상태인지. 렌더링 중에 계산하는 파생 값이다 */
export const useNightAutoDark = (): boolean => {
  const enabled = useSettingsStore((s) => s.nightAutoDark)
  const override = useSettingsStore((s) => s.nightOverride)
  const now = useUiStore((s) => s.now)
  return enabled && isNightHours(now) && override !== nightKey(now)
}

/**
 * 테마를 <html class="dark">에 반영한다.
 * 사용자 설정(라이트/다크/시스템)을 따르되, 밤 시간대에는 자동으로 어둡게 바꾼다.
 */
export const useTheme = () => {
  const theme = useSettingsStore((s) => s.theme)
  const pushToast = useUiStore((s) => s.pushToast)
  const autoDark = useNightAutoDark()
  const wasAutoDark = useRef(autoDark)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = autoDark || theme === 'dark' || (theme === 'system' && media.matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme, autoDark])

  // 앱을 켜 둔 채로 저녁 7시를 넘긴 순간에만 알려 준다
  useEffect(() => {
    if (autoDark && !wasAutoDark.current) pushToast('저녁 7시가 지나 화면을 어둡게 바꿨어요.')
    wasAutoDark.current = autoDark
  }, [autoDark, pushToast])
}
