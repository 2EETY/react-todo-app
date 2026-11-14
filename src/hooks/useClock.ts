import { useUiStore } from '../store/useUiStore'
import { useInterval } from './useInterval'

const TICK_MS = 30_000

/**
 * 앱 최상단에서 한 번만 호출한다. 시계를 하나로 모아 두면
 * 날짜 표시, 배경 빛, 자동 다크 모드가 모두 같은 시각을 기준으로 움직인다.
 */
export const useClock = () => {
  const tick = useUiStore((s) => s.tick)
  useInterval(tick, TICK_MS)
}
