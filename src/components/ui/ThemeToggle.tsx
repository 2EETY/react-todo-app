import { Monitor, Moon, Sun } from 'lucide-react'
import { type ThemeMode, useSettingsStore } from '../../store/useSettingsStore'
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
