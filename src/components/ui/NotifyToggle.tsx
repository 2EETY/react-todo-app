import { Bell, BellOff } from 'lucide-react'
import { useSettingsStore } from '../../store/useSettingsStore'
import { useUiStore } from '../../store/useUiStore'
import { IconButton } from './IconButton'

export const NotifyToggle = () => {
  const on = useSettingsStore((s) => s.browserNotify)
  const setOn = useSettingsStore((s) => s.setBrowserNotify)
  const pushToast = useUiStore((s) => s.pushToast)

  const toggle = async () => {
    if (on) {
      setOn(false)
      pushToast('브라우저 알림을 껐어요. 화면 안 알림은 계속 보여요.')
      return
    }
    if (!('Notification' in window)) {
      pushToast('이 브라우저는 알림을 지원하지 않아요.')
      return
    }
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      setOn(true)
      pushToast('브라우저 알림을 켰어요. 일정 시간이 되면 알려 드릴게요.')
    } else {
      pushToast('알림 권한이 막혀 있어요. 주소창 왼쪽 사이트 설정에서 허용해 주세요.')
    }
  }

  return (
    <IconButton
      label={on ? '브라우저 알림 끄기' : '브라우저 알림 켜기'}
      aria-pressed={on}
      icon={on ? <Bell size={19} strokeWidth={1.8} /> : <BellOff size={19} strokeWidth={1.8} />}
      onClick={toggle}
    />
  )
}
