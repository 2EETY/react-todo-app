import { range, seeded } from '../../../lib/random'

const rand = seeded(83)

const makeTrunks = (count: number, minW: number, maxW: number) =>
  Array.from({ length: count }, (_, i) => {
    const side = i % 2 === 0 ? range(rand, -40, 600) : range(rand, 1000, 1640)
    return { x: side, w: range(rand, minW, maxW) }
  })

const BACK = makeTrunks(22, 10, 22)
const FRONT = makeTrunks(10, 34, 70)
const MOTES = Array.from({ length: 26 }, () => ({
  x: range(rand, 300, 1300),
  y: range(rand, 200, 760),
  r: range(rand, 1.5, 3.5),
  delay: -range(rand, 0, 12),
}))

/** 숲 산책길: 빛줄기가 내려오는 소실점 오솔길 */
export const ForestWalk = () => (
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
    <defs>
      <linearGradient id="forest-air" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c9d6c4" />
        <stop offset="0.55" stopColor="#e8ecdf" />
        <stop offset="1" stopColor="#c6cfb5" />
      </linearGradient>
      <linearGradient id="forest-canopy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7f9479" stopOpacity="0.95" />
        <stop offset="1" stopColor="#7f9479" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#forest-air)" />
    <g fill="#fffbe8">
      <polygon className="ray" points="980,0 1080,0 860,900 700,900" />
      <polygon className="ray" style={{ animationDelay: '-3s' }} points="1150,0 1210,0 1010,900 920,900" />
      <polygon className="ray" style={{ animationDelay: '-6s' }} points="820,0 870,0 600,900 520,900" />
    </g>
    {BACK.map((t, i) => (
      <rect key={`b${i}`} x={t.x} y="0" width={t.w} height="640" fill="#a9b6a1" opacity="0.75" />
    ))}
    <path d="M0 600 C400 585 1200 585 1600 600 L1600 900 L0 900Z" fill="#9fb08f" />
    <path d="M770 600 L830 600 C900 700 1050 820 1180 905 L420 905 C550 820 700 700 770 600Z" fill="#d6c9a8" />
    {FRONT.map((t, i) => (
      <rect key={`f${i}`} x={t.x} y="0" width={t.w} height="905" fill="#5f6f5e" opacity="0.85" />
    ))}
    <rect width="1600" height="260" fill="url(#forest-canopy)" />
    {MOTES.map((m, i) => (
      <circle key={i} className="mote" style={{ animationDelay: `${m.delay}s` }} cx={m.x} cy={m.y} r={m.r} fill="#fffbe2" opacity="0.7" />
    ))}
  </svg>
)
