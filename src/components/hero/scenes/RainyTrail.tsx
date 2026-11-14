import { range, seeded } from '../../../lib/random'

const rand = seeded(47)
const DROPS = Array.from({ length: 170 }, () => ({
  x: range(rand, 0, 1700),
  y: range(rand, 0, 900),
  len: range(rand, 14, 32),
  opacity: range(rand, 0.25, 0.6),
}))

const PINES = Array.from({ length: 26 }, (_, i) => {
  const left = i % 2 === 0
  const depth = i / 26
  return {
    x: left ? range(rand, 120, 640) : range(rand, 960, 1500),
    y: 560 + depth * 180,
    s: 0.5 + depth * 1.1,
  }
})

/** 비 내리는 산길: 겹겹의 능선 + 안개 + 굽은 오솔길 */
export const RainyTrail = () => (
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
    <defs>
      <linearGradient id="rain-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bcc7ca" />
        <stop offset="1" stopColor="#e1e6e4" />
      </linearGradient>
      <linearGradient id="rain-mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#f2f4f2" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#rain-sky)" />
    <path d="M0 420 L180 300 L330 380 L520 250 L720 360 L900 280 L1100 380 L1300 270 L1600 390 L1600 900 L0 900Z" fill="#a3b1b3" />
    <rect y="330" width="1600" height="160" fill="url(#rain-mist)" />
    <path d="M0 520 L260 410 L470 480 L700 400 L980 490 L1230 410 L1600 500 L1600 900 L0 900Z" fill="#8a9c9c" />
    <rect y="450" width="1600" height="140" fill="url(#rain-mist)" />
    <path d="M0 600 C300 560 520 590 800 570 C1080 550 1320 590 1600 575 L1600 900 L0 900Z" fill="#748a80" />
    <path d="M760 585 C790 620 700 660 720 720 C740 790 600 840 520 905 L1080 905 C980 840 880 800 870 730 C860 670 840 625 820 585Z" fill="#b8b2a1" />
    {PINES.map((p, i) => (
      <path key={i} d={`M${p.x} ${p.y - 90 * p.s} L${p.x + 26 * p.s} ${p.y} L${p.x - 26 * p.s} ${p.y}Z`} fill="#56685f" opacity={0.55 + p.s * 0.25} />
    ))}
    <g className="rain">
      {[0, 1].map((copy) =>
        DROPS.map((d, i) => (
          <line
            key={`${copy}-${i}`}
            x1={d.x + copy * 90}
            y1={d.y - copy * 900}
            x2={d.x + copy * 90 - d.len * 0.1}
            y2={d.y - copy * 900 + d.len}
            stroke="#ffffff"
            strokeOpacity={d.opacity}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        )),
      )}
    </g>
  </svg>
)
