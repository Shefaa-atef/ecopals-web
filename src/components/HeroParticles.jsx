import './HeroParticles.css'

// Each left particle has a mirrored right counterpart — same shape, size, and opacity.
// Delays are staggered so the two sides don't pulse in perfect sync.
const PARTICLES = [
  // ── Left side (4 leaves · 2 sparkles · 3 glows) ─────────────────────────────
  { id: 1,  shape: 'leaf',    left: '5%',  top: '76%', size: 20, color: '#69b95f', opacity: 0.55, dur: 9,  delay: 0,   dx:  18, rs:  20, re: 165 },
  { id: 2,  shape: 'sparkle', left: '13%', top: '53%', size: 13, color: '#f6c85f', opacity: 0.60, dur: 7,  delay: 1.6, dx: -14, rs:   0, re:  75 },
  { id: 3,  shape: 'leaf',    left: '22%', top: '85%', size: 17, color: '#2f6f3e', opacity: 0.48, dur: 11, delay: 3.1, dx:  22, rs:  55, re: 200 },
  { id: 4,  shape: 'glow',    left: '8%',  top: '34%', size:  9, color: '#e3faf5', opacity: 0.62, dur: 8,  delay: 0.9, dx: -10, rs:   0, re:   0 },
  { id: 5,  shape: 'sparkle', left: '31%', top: '46%', size: 14, color: '#f6c85f', opacity: 0.50, dur: 10, delay: 4.2, dx:  16, rs:  20, re: 110 },
  { id: 6,  shape: 'leaf',    left: '42%', top: '88%', size: 22, color: '#69b95f', opacity: 0.44, dur: 12, delay: 1.1, dx: -20, rs: 100, re: 255 },
  { id: 7,  shape: 'glow',    left: '17%', top: '63%', size:  8, color: '#74cbd5', opacity: 0.55, dur: 7,  delay: 2.3, dx:   8, rs:   0, re:   0 },
  { id: 8,  shape: 'leaf',    left: '35%', top: '27%', size: 16, color: '#2f6f3e', opacity: 0.42, dur: 10, delay: 5.1, dx:  20, rs:  40, re: 185 },
  { id: 9,  shape: 'glow',    left: '47%', top: '69%', size:  7, color: '#d9f2df', opacity: 0.50, dur: 8,  delay: 3.6, dx:  -8, rs:   0, re:   0 },
  // ── Right side — mirrors left (4 leaves · 2 sparkles · 3 glows) ─────────────
  { id: 10, shape: 'leaf',    left: '95%', top: '76%', size: 20, color: '#69b95f', opacity: 0.55, dur: 9,  delay: 0.6, dx: -18, rs: 165, re:  20 },
  { id: 11, shape: 'sparkle', left: '87%', top: '53%', size: 13, color: '#f6c85f', opacity: 0.60, dur: 7,  delay: 2.2, dx:  14, rs:  75, re:   0 },
  { id: 12, shape: 'leaf',    left: '78%', top: '85%', size: 17, color: '#2f6f3e', opacity: 0.48, dur: 11, delay: 3.7, dx: -22, rs: 200, re:  55 },
  { id: 13, shape: 'glow',    left: '92%', top: '34%', size:  9, color: '#e3faf5', opacity: 0.62, dur: 8,  delay: 1.5, dx:  10, rs:   0, re:   0 },
  { id: 14, shape: 'sparkle', left: '69%', top: '46%', size: 14, color: '#f6c85f', opacity: 0.50, dur: 10, delay: 4.8, dx: -16, rs: 110, re:  20 },
  { id: 15, shape: 'leaf',    left: '58%', top: '88%', size: 22, color: '#69b95f', opacity: 0.44, dur: 12, delay: 1.7, dx:  20, rs: 255, re: 100 },
  { id: 16, shape: 'glow',    left: '83%', top: '63%', size:  8, color: '#74cbd5', opacity: 0.55, dur: 7,  delay: 2.9, dx:  -8, rs:   0, re:   0 },
  { id: 17, shape: 'leaf',    left: '65%', top: '27%', size: 16, color: '#2f6f3e', opacity: 0.42, dur: 10, delay: 5.7, dx: -20, rs: 185, re:  40 },
  { id: 18, shape: 'glow',    left: '53%', top: '69%', size:  7, color: '#d9f2df', opacity: 0.50, dur: 8,  delay: 4.2, dx:   8, rs:   0, re:   0 },
  // ── Mobile bottom fill — keeps the CTA area lively without adding new shapes
  { id: 19, shape: 'leaf',    left: '14%', top: '92%', size: 18, color: '#69b95f', opacity: 0.5,  dur: 10, delay: 0.4, dx:  16, rs:  28, re: 150, mobileOnly: true },
  { id: 20, shape: 'leaf',    left: '86%', top: '91%', size: 18, color: '#69b95f', opacity: 0.5,  dur: 10, delay: 1.0, dx: -16, rs: 150, re:  28, mobileOnly: true },
  { id: 21, shape: 'sparkle', left: '28%', top: '82%', size: 10, color: '#f6c85f', opacity: 0.58, dur: 7,  delay: 1.7, dx: -10, rs:   0, re:  85, mobileOnly: true },
  { id: 22, shape: 'sparkle', left: '72%', top: '83%', size: 10, color: '#f6c85f', opacity: 0.58, dur: 7,  delay: 2.3, dx:  10, rs:  85, re:   0, mobileOnly: true },
  { id: 23, shape: 'leaf',    left: '42%', top: '96%', size: 16, color: '#2f6f3e', opacity: 0.38, dur: 12, delay: 3.0, dx: -14, rs:  80, re: 215, mobileOnly: true },
  { id: 24, shape: 'leaf',    left: '58%', top: '96%', size: 16, color: '#2f6f3e', opacity: 0.38, dur: 12, delay: 3.6, dx:  14, rs: 215, re:  80, mobileOnly: true },
]

function Leaf({ color }) {
  return (
    <svg viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path
        d="M10 1 C18 6 19 18 10 27 C1 18 2 6 10 1 Z"
        fill={color}
      />
      <path
        d="M10 27 Q10.6 17 10 3"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Sparkle({ color }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path
        d="M12 1 L13.1 10.9 L22 12 L13.1 13.1 L12 23 L10.9 13.1 L2 12 L10.9 10.9 Z"
        fill={color}
      />
    </svg>
  )
}

function Glow({ color }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="12" cy="12" r="7" fill={color} />
      <circle cx="12" cy="12" r="10" fill={color} opacity="0.25" />
    </svg>
  )
}

const SHAPE_MAP = { leaf: Leaf, sparkle: Sparkle, glow: Glow }

export default function HeroParticles() {
  return (
    <div className="hero-particles" aria-hidden="true">
      {PARTICLES.map((p) => {
        const Shape = SHAPE_MAP[p.shape]
        return (
          <div
            key={p.id}
            className={`hp${p.mobileOnly ? ' hp--mobile-fill' : ''}`}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              '--p-opacity': p.opacity,
              '--p-dur': `${p.dur}s`,
              '--p-delay': `${p.delay}s`,
              '--p-dx': `${p.dx}px`,
              '--p-rs': `${p.rs}deg`,
              '--p-re': `${p.re}deg`,
            }}
          >
            <Shape color={p.color} />
          </div>
        )
      })}
    </div>
  )
}
