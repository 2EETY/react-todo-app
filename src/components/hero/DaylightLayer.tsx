import clsx from 'clsx'
import { type DayPhase, getDayPhase } from '../../lib/dayPhase'
import { range, seeded } from '../../lib/random'
import { useUiStore } from '../../store/useUiStore'

/**
 * 시간대별 빛. 그라데이션은 transition이 안 되므로
 * 다섯 장을 겹쳐 두고 해당 시간대만 opacity를 올려 천천히 바꾼다.
 */
const LIGHT: Record<DayPhase, string> = {
  dawn: 'bg-gradient-to-b from-[#b89ab0]/55 via-[#e8b8a4]/40 to-[#f3d2b0]/25 mix-blend-multiply',
  morning: 'bg-gradient-to-b from-[#fff4d8]/50 to-transparent mix-blend-soft-light',
  day: 'bg-transparent',
  dusk: 'bg-gradient-to-b from-[#7d5f86]/50 via-[#d98a5c]/45 to-[#efb877]/35 mix-blend-multiply',
  night: 'bg-gradient-to-b from-[#1d1a24]/85 via-[#29231f]/75 to-[#2b241c]/70 mix-blend-multiply',
}

const PHASES = Object.keys(LIGHT) as DayPhase[]

const rand = seeded(7)
const STARS = Array.from({ length: 46 }, () => ({
  x: range(rand, 2, 98),
  y: range(rand, 2, 42),
  size: range(rand, 1, 2.6),
  delay: -range(rand, 0, 6),
}))

export const DaylightLayer = () => {
  const phase = getDayPhase(useUiStore((s) => s.now))

  return (
    <>
      {PHASES.map((p) => (
        <div
          key={p}
          className={clsx(
            'absolute inset-0 transition-opacity duration-4000 ease-in-out',
            LIGHT[p],
            // 다크 모드는 바탕이 이미 어두워서 빛을 절반만 겹친다.
            // 밤에 라이트 모드를 고른 경우엔 글자가 묻히지 않게 밤빛을 덜 겹친다
            p !== phase ? 'opacity-0' : p === 'night' ? 'opacity-60 dark:opacity-55' : 'opacity-100 dark:opacity-55',
          )}
        />
      ))}
    </>
  )
}

/** 밤하늘의 별. 바탕 안개보다 위에 그려야 보인다 */
export const NightStars = () => {
  const isNight = getDayPhase(useUiStore((s) => s.now)) === 'night'

  return (
    <div className={clsx('absolute inset-0 transition-opacity duration-4000', isNight ? 'opacity-100' : 'opacity-0')}>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-[#fff6e0]"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  )
}
