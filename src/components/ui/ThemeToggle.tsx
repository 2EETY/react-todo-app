import { Monitor, Moon, MoonStar, Sun } from 'lucide-react'
import { useNightAutoDark } from '../../hooks/useTheme'
import { nightKey } from '../../lib/dayPhase'
import { type ThemeMode, useSettingsStore } from '../../store/useSettingsStore'
import { useUiStore } from '../../store/useUiStore'
import { IconButton } from './IconButton'

const ORDER: ThemeMode[] = ['light', 'dark', 'system']
const META: Record<ThemeMode, { label: string; icon: typeof Sun }> = {
  light: { label: '밝은 테마', icon: Sun },
  dark: { label: '어두운 테마', icon: Moon },
  system: { label: '기기 설정을 따름', icon: Monitor },
}

export const ThemeToggle = () => {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const setNightOverride = useSettingsStore((s) => s.setNightOverride)
  const now = useUiStore((s) => s.now)
  const autoDark = useNightAutoDark()

  // 밤 자동 다크 중에 누르면, 오늘 밤만 사용자 설정으로 돌아간다
  if (autoDark) {
    return (
      <IconButton
        label={`밤이라 어둡게 보여 주는 중이에요. 누르면 오늘 밤은 내 설정(${META[theme].label})으로 봐요`}
        icon={<MoonStar size={19} strokeWidth={1.8} />}
        onClick={() => setNightOverride(nightKey(now))}
      />
    )
  }

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]
  const Icon = META[theme].icon
  return (
    <IconButton
      label={`테마: ${META[theme].label} (누르면 ${META[next].label})`}
      icon={<Icon size={19} strokeWidth={1.8} />}
      onClick={() => setTheme(next)}
    />
  )
}
