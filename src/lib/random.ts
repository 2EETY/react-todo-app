/** 시드 고정 난수 (mulberry32). 새로고침해도 풍경 모양이 같도록 */
export const seeded = (seed: number) => {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const range = (rand: () => number, min: number, max: number) => min + rand() * (max - min)
