/** 주기 200의 물결선. drift 애니메이션(-200px)과 맞물려 끊김 없이 흐른다 */
const wavePath = (y: number, amp: number): string => `M-200 ${y}` + ` q50 ${-amp} 100 0 t100 0`.repeat(11)

const WAVES = [
  { y: 540, amp: 3, opacity: 0.35, width: 1.2, duration: 22 },
  { y: 600, amp: 5, opacity: 0.4, width: 1.5, duration: 18 },
  { y: 670, amp: 7, opacity: 0.45, width: 1.8, duration: 14 },
  { y: 750, amp: 9, opacity: 0.5, width: 2.2, duration: 11 },
]

const GLINTS = Array.from({ length: 14 }, (_, i) => ({
  y: 500 + i * 22,
  w: 150 - i * 7 + (i % 3) * 18,
  delay: -(i * 0.45),
}))

/** 잔잔한 바다: 낮은 해, 물빛 반사, 천천히 흐르는 물결 */
export const QuietSea = () => (
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
    <defs>
      <linearGradient id="sea-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d3e0e4" />
        <stop offset="1" stopColor="#f3ede0" />
      </linearGradient>
      <linearGradient id="sea-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a8c0c4" />
        <stop offset="1" stopColor="#6f9097" />
      </linearGradient>
      <radialGradient id="sea-sun">
        <stop offset="0" stopColor="#fff6dc" />
        <stop offset="0.35" stopColor="#fff6dc" stopOpacity="0.8" />
        <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1600" height="490" fill="url(#sea-sky)" />
    <circle cx="800" cy="420" r="170" fill="url(#sea-sun)" />
    <rect y="488" width="1600" height="412" fill="url(#sea-water)" />
    {GLINTS.map((g, i) => (
      <rect key={i} className="shimmer" style={{ animationDelay: `${g.delay}s` }} x={800 - g.w / 2} y={g.y} width={g.w} height="3" rx="1.5" fill="#fff8e6" />
    ))}
    {WAVES.map((w, i) => (
      <path key={i} className="wave" style={{ animationDuration: `${w.duration}s` }} d={wavePath(w.y, w.amp)} fill="none" stroke="#eef4f2" strokeOpacity={w.opacity} strokeWidth={w.width} />
    ))}
    <path d="M0 820 C260 790 520 815 800 800 C1100 785 1350 810 1600 795 L1600 900 L0 900Z" fill="#e6dcc4" />
    <path d="M0 822 C260 792 520 817 800 802 C1100 787 1350 812 1600 797" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="3" />
  </svg>
)
