import { range, seeded } from '../../../lib/random'

interface Reed {
  x: number
  h: number
  bend: number
  width: number
  color: string
  delay: number
  duration: number
}

const makeRow = (seed: number, count: number, minH: number, maxH: number, colors: string[]): Reed[] => {
  const rand = seeded(seed)
  return Array.from({ length: count }, () => ({
    x: range(rand, -40, 1640),
    h: range(rand, minH, maxH),
    bend: range(rand, -30, 50),
    width: range(rand, 1.4, 3.2),
    color: colors[Math.floor(rand() * colors.length)],
    delay: -range(rand, 0, 5),
    duration: range(rand, 3.8, 6.2),
  }))
}

// 화면 렌더링마다 다시 만들 필요가 없어 모듈 상수로 둔다
const BACK = makeRow(11, 90, 160, 300, ['#cdb98a', '#d6c497', '#c5ae7a'])
const FRONT = makeRow(29, 70, 300, 560, ['#b59a5b', '#a88b4e', '#c4a96c', '#9c8048'])

const ReedRow = ({ reeds, plume }: { reeds: Reed[]; plume: string }) => (
  <g>
    {reeds.map((r, i) => {
      const tipX = r.x + r.bend
      const tipY = 900 - r.h
      return (
        <g key={i} className="reed" style={{ animationDelay: `${r.delay}s`, animationDuration: `${r.duration}s` }}>
          <path d={`M${r.x} 905 Q${r.x + r.bend * 0.2} ${900 - r.h / 2} ${tipX} ${tipY}`} stroke={r.color} strokeWidth={r.width} fill="none" strokeLinecap="round" />
          <ellipse cx={tipX + r.bend * 0.08} cy={tipY - 22} rx={r.width * 3.2} ry={30} fill={plume} opacity={0.85} transform={`rotate(${r.bend * 0.35} ${tipX} ${tipY})`} />
        </g>
      )
    })}
  </g>
)

export const ReedField = () => (
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
    <defs>
      <linearGradient id="reed-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#efe4c8" />
        <stop offset="0.6" stopColor="#f2eedf" />
        <stop offset="1" stopColor="#e4dcc0" />
      </linearGradient>
      <radialGradient id="reed-sun">
        <stop offset="0" stopColor="#fff8e2" />
        <stop offset="1" stopColor="#fff8e2" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#reed-sky)" />
    <circle cx="1180" cy="290" r="260" fill="url(#reed-sun)" />
    <path d="M0 560 C220 500 420 540 640 515 C900 485 1140 545 1600 500 L1600 900 L0 900Z" fill="#cfcfb4" opacity="0.7" />
    <path d="M0 640 C300 600 700 650 1000 620 C1250 598 1450 630 1600 615 L1600 900 L0 900Z" fill="#dccb9e" />
    <ReedRow reeds={BACK} plume="#efe2bd" />
    <ReedRow reeds={FRONT} plume="#e8d4a2" />
  </svg>
)
