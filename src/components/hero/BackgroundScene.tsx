import clsx from 'clsx'
import { useInterval } from '../../hooks/useInterval'
import { useSettingsStore } from '../../store/useSettingsStore'
import { DaylightLayer, NightStars } from './DaylightLayer'
import { SCENES } from './scenes'

const SCENE_MS = 25_000 // 문구(5초)보다 느리게, 풍경은 천천히 바뀐다

/** 화면 뒤에 깔리는 자연 풍경. 모든 장면을 겹쳐 두고 opacity로 교차 전환한다 */
export const BackgroundScene = () => {
  const index = useSettingsStore((s) => s.sceneIndex) % SCENES.length
  const setIndex = useSettingsStore((s) => s.setSceneIndex)

  useInterval(() => setIndex((index + 1) % SCENES.length), SCENE_MS)

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {SCENES.map((scene, i) => (
        <div
          key={scene.id}
          className={clsx(
            // 다크 모드: 풍경을 등잔불에 비춘 듯 세피아로 데워 푸른 기운을 뺀다
            'absolute inset-0 transition-opacity duration-2500 ease-in-out dark:brightness-90 dark:saturate-[.7] dark:sepia-[.45]',
            i === index ? 'opacity-100' : 'scene-paused opacity-0',
          )}
        >
          {scene.image ? <img src={scene.image} alt="" className="size-full object-cover" /> : <scene.Illustration />}
        </div>
      ))}
      <DaylightLayer />
      {/* 풍경을 연하게: 위쪽은 투명하게, 아래로 갈수록 바탕색이 덮이도록 */}
      <div className="absolute inset-0 bg-gradient-to-b from-fog/35 via-fog/55 to-fog/85 dark:from-night/65 dark:via-night/78 dark:to-night/92" />
      <NightStars />
    </div>
  )
}

export const ScenePicker = () => {
  const index = useSettingsStore((s) => s.sceneIndex) % SCENES.length
  const setIndex = useSettingsStore((s) => s.setSceneIndex)

  return (
    <div role="group" aria-label="배경 풍경 고르기" className="flex items-center gap-1">
      {SCENES.map((scene, i) => (
        <button
          key={scene.id}
          type="button"
          onClick={() => setIndex(i)}
          aria-pressed={i === index}
          className={clsx(
            'rounded-full px-2.5 py-1 text-xs transition-colors',
            i === index
              ? 'bg-ink/10 text-ink dark:bg-moon/15 dark:text-moon'
              : 'text-moss hover:text-ink dark:text-moon/70 dark:hover:text-moon',
          )}
        >
          {scene.name}
        </button>
      ))}
    </div>
  )
}
