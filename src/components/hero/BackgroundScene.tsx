import clsx from 'clsx'
import { useInterval } from '../../hooks/useInterval'
import { useSettingsStore } from '../../store/useSettingsStore'
import { SCENES } from './scenes'

const SCENE_MS = 25_000 // 문구(5초)보다 느리게, 풍경은 천천히 바뀐다

/** 화면 뒤에 깔리는 자연 풍경. 모든 장면을 겹쳐 두고 opacity로 교차 전환한다 */
export const BackgroundScene = () => {
  const index = useSettingsStore((s) => s.sceneIndex) % SCENES.length
  const setIndex = useSettingsStore((s) => s.setSceneIndex)

  useInterval(() => setIndex((index + 1) % SCENES.length), SCENE_MS)

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      {SCENES.map((scene, i) => (
        <div
          key={scene.id}
          className={clsx(
            'absolute inset-0 transition-opacity duration-[2500ms] ease-in-out',
            i === index ? 'opacity-100' : 'scene-paused opacity-0',
          )}
        >
          {scene.image ? <img src={scene.image} alt="" className="size-full object-cover" /> : <scene.Illustration />}
        </div>
      ))}
      {/* 풍경을 연하게: 위쪽은 투명하게, 아래로 갈수록 바탕색이 덮이도록 */}
      <div className="absolute inset-0 bg-gradient-to-b from-fog/35 via-fog/55 to-fog/85 dark:from-night/70 dark:via-night/80 dark:to-night/92" />
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
              : 'text-moss/80 hover:text-ink dark:text-moon/50 dark:hover:text-moon',
          )}
        >
          {scene.name}
        </button>
      ))}
    </div>
  )
}
