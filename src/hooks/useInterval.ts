import { useEffect, useRef } from 'react'

/** setInterval을 React에서 안전하게 쓰기 위한 훅. 콜백이 바뀌어도 타이머를 다시 만들지 않는다. */
export const useInterval = (callback: () => void, delay: number | null) => {
  const saved = useRef(callback)

  useEffect(() => {
    saved.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = window.setInterval(() => saved.current(), delay)
    return () => window.clearInterval(id)
  }, [delay])
}
