import type { SceneKind } from '@/game/types'

// 墨线纸面风格的场景插画（SVG，无外部图片依赖）
const INK = '#2f3a32'
const FADE = '#8a9484'
const PAPER = '#f6f5ef'
const ACCENT = '#b8512f'

function Person({ x, y, seated = false, calm = false }: { x: number; y: number; seated?: boolean; calm?: boolean }) {
  return (
    <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
      <circle cx={x} cy={y} r="9" fill={PAPER} />
      {seated ? (
        <>
          <path d={`M ${x} ${y + 9} v 18`} />
          <path d={`M ${x} ${y + 27} h 14 v 12`} />
          <path d={`M ${x} ${y + 15} l ${calm ? 12 : -10} 8`} />
        </>
      ) : (
        <>
          <path d={`M ${x} ${y + 9} v 24`} />
          <path d={`M ${x} ${y + 33} l -9 16 M ${x} ${y + 33} l 9 16`} />
          <path d={`M ${x} ${y + 16} l -11 9 M ${x} ${y + 16} l 11 9`} />
        </>
      )}
    </g>
  )
}

function Smoke({ dense = false }: { dense?: boolean }) {
  const wisps = dense ? [0, 1, 2, 3, 4] : [0, 1, 2]
  return (
    <g>
      {wisps.map((i) => (
        <ellipse
          key={i}
          className="scene-smoke"
          style={{ animationDelay: `${i * 0.9}s` }}
          cx={150 + i * 34}
          cy={120 - i * 8}
          rx={26 + i * 7}
          ry={13 + i * 4}
          fill={FADE}
          opacity={dense ? 0.34 : 0.22}
        />
      ))}
    </g>
  )
}

function Room({ people, smoke, vent = true }: { people: React.ReactNode; smoke?: React.ReactNode; vent?: boolean }) {
  return (
    <g>
      <rect x="20" y="16" width="360" height="150" rx="4" fill={PAPER} stroke={INK} strokeWidth="2.4" />
      <line x1="20" y1="136" x2="380" y2="136" stroke={INK} strokeWidth="2" />
      {vent && (
        <g stroke={INK} strokeWidth="2">
          <rect x="330" y="34" width="34" height="18" fill="none" />
          <line x1="336" y1="34" x2="336" y2="52" />
          <line x1="344" y1="34" x2="344" y2="52" />
          <line x1="352" y1="34" x2="352" y2="52" />
        </g>
      )}
      {smoke}
      <rect x="120" y="112" width="160" height="10" fill={PAPER} stroke={INK} strokeWidth="2.2" />
      {people}
    </g>
  )
}

function Newspaper() {
  return (
    <g>
      <rect x="70" y="18" width="260" height="150" rx="3" fill={PAPER} stroke={INK} strokeWidth="2.4" transform="rotate(-2 200 93)" />
      <g transform="rotate(-2 200 93)">
        <rect x="86" y="32" width="150" height="14" fill={INK} opacity="0.85" />
        <rect x="86" y="54" width="228" height="5" fill={FADE} />
        <rect x="86" y="64" width="228" height="5" fill={FADE} />
        <rect x="86" y="74" width="228" height="5" fill={FADE} />
        <rect x="86" y="84" width="108" height="60" fill="none" stroke={INK} strokeWidth="2" />
        <circle cx="140" cy="106" r="12" fill="none" stroke={INK} strokeWidth="2" />
        <path d="M 128 128 q 12 -10 24 0" stroke={INK} strokeWidth="2" fill="none" />
        <rect x="206" y="88" width="108" height="5" fill={FADE} />
        <rect x="206" y="98" width="108" height="5" fill={FADE} />
        <rect x="206" y="108" width="108" height="5" fill={FADE} />
        <rect x="206" y="118" width="108" height="5" fill={FADE} />
        <rect x="206" y="128" width="108" height="5" fill={FADE} />
        <text x="92" y="44" fill={PAPER} fontSize="11" fontFamily="Georgia, serif" fontWeight="bold">
          38 WHO SAW MURDER DIDN'T CALL
        </text>
      </g>
    </g>
  )
}

function Office() {
  return (
    <g>
      <rect x="20" y="16" width="360" height="150" rx="4" fill={PAPER} stroke={INK} strokeWidth="2.4" />
      <rect x="60" y="110" width="280" height="10" fill={PAPER} stroke={INK} strokeWidth="2.2" />
      <Person x={140} y={84} seated />
      <Person x={260} y={84} seated />
      <g stroke={ACCENT} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M 176 70 q 24 -22 48 0" strokeDasharray="4 5" />
        <path d="M 222 66 l 6 4 -7 3" />
      </g>
      <rect x="176" y="116" width="48" height="30" fill="none" stroke={INK} strokeWidth="2" />
      <line x1="182" y1="124" x2="218" y2="124" stroke={FADE} strokeWidth="2" />
      <line x1="182" y1="131" x2="218" y2="131" stroke={FADE} strokeWidth="2" />
      <line x1="182" y1="138" x2="210" y2="138" stroke={FADE} strokeWidth="2" />
    </g>
  )
}

function Intercom() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={36 + i * 118} y="26" width="104" height="132" rx="4" fill={PAPER} stroke={INK} strokeWidth="2.2" />
          <Person x={88 + i * 118} y={72} seated />
          <rect x={64 + i * 118} y={112} width="48" height="26" rx="3" fill="none" stroke={INK} strokeWidth="2" />
          <circle cx={76 + i * 118} cy={125} r="3" fill={i === 1 ? ACCENT : FADE} />
          <line x1={86 + i * 118} y1={120} x2={106 + i * 118} y2={120} stroke={FADE} strokeWidth="2" />
          <line x1={86 + i * 118} y1={126} x2={106 + i * 118} y2={126} stroke={FADE} strokeWidth="2" />
        </g>
      ))}
      <g stroke={ACCENT} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M 60 20 q 10 -12 20 0" className="scene-pulse" />
        <path d="M 54 16 q 16 -20 32 0" className="scene-pulse" style={{ animationDelay: '0.4s' }} />
      </g>
    </g>
  )
}

function Chart() {
  const bars = [
    { label: '独处', pct: 75 },
    { label: '陌生三人', pct: 38 },
    { label: '演员组', pct: 10 },
  ]
  return (
    <g>
      <rect x="20" y="16" width="360" height="150" rx="4" fill={PAPER} stroke={INK} strokeWidth="2.4" />
      {bars.map((b, i) => (
        <g key={b.label}>
          <text x="52" y={60 + i * 38} fontSize="12" fill={INK} fontFamily="Georgia, serif" textAnchor="end">
            {b.label}
          </text>
          <rect x="62" y={48 + i * 38} width={b.pct * 3.4} height="18" rx="2" fill={i === 0 ? '#597865' : i === 1 ? '#8a9484' : ACCENT} opacity="0.9" />
          <text x={70 + b.pct * 3.4} y={62 + i * 38} fontSize="13" fill={INK} fontWeight="bold" fontFamily="Georgia, serif">
            {b.pct}%
          </text>
        </g>
      ))}
      <text x="200" y="156" fontSize="11" fill={FADE} textAnchor="middle" fontFamily="Georgia, serif">
        十分钟内报告烟雾的被试比例
      </text>
    </g>
  )
}

function Street() {
  return (
    <g>
      <rect x="20" y="16" width="360" height="150" rx="4" fill={PAPER} stroke={INK} strokeWidth="2.4" />
      <line x1="20" y1="140" x2="380" y2="140" stroke={INK} strokeWidth="2" />
      <Person x={120} y={96} />
      <g stroke={ACCENT} strokeWidth="2.2" fill="none" strokeLinecap="round">
        <path d="M 136 96 q 20 -14 34 -2" />
        <path d="M 172 90 l 6 4 -7 4" />
      </g>
      <Person x={240} y={96} />
      <g fill="none" stroke={FADE} strokeWidth="2">
        <circle cx="310" cy="96" r="9" />
        <path d="M 310 105 v 22 M 310 127 l -8 14 M 310 127 l 8 14" />
      </g>
      <g fill="none" stroke={FADE} strokeWidth="2" opacity="0.6">
        <circle cx="346" cy="96" r="9" />
        <path d="M 346 105 v 22 M 346 127 l -8 14 M 346 127 l 8 14" />
      </g>
    </g>
  )
}

function Books() {
  return (
    <g>
      <rect x="20" y="16" width="360" height="150" rx="4" fill={PAPER} stroke={INK} strokeWidth="2.4" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={96 + i * 46} y={52 - (i % 2) * 6} width="34" height={88 + (i % 2) * 6} rx="2" fill={PAPER} stroke={INK} strokeWidth="2.2" />
      ))}
      <text x="200" y="158" fontSize="12" fill={FADE} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic">
        The Unresponsive Bystander · 1970
      </text>
    </g>
  )
}

export default function Scene({ kind }: { kind: SceneKind }) {
  return (
    <svg viewBox="0 0 400 180" className="scene-svg" role="img" aria-label={`场景插画：${kind}`}>
      {kind === 'newspaper' && <Newspaper />}
      {kind === 'office' && <Office />}
      {kind === 'room-alone' && (
        <Room
          smoke={<Smoke />}
          people={<Person x={180} y={80} seated />}
        />
      )}
      {kind === 'room-three' && (
        <Room
          smoke={<Smoke dense />}
          people={
            <>
              <Person x={120} y={80} seated />
              <Person x={200} y={80} seated />
              <Person x={280} y={80} seated />
            </>
          }
        />
      )}
      {kind === 'room-actors' && (
        <Room
          smoke={<Smoke dense />}
          people={
            <>
              <Person x={120} y={80} seated calm />
              <Person x={200} y={80} seated />
              <Person x={280} y={80} seated calm />
            </>
          }
        />
      )}
      {kind === 'intercom' && <Intercom />}
      {kind === 'chart' && <Chart />}
      {kind === 'street' && <Street />}
      {kind === 'books' && <Books />}
    </svg>
  )
}
