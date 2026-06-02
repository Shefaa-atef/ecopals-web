import './HeroParticles.css'

const PARTICLES = [
  { id: 1,  shape: 'leaf',    left: '3%',  top: '78%', size: 22, color: '#7fb366', opacity: 0.55, dur: 9,  delay: 0,   dx:  18, rs:  20, re: 160 },
  { id: 2,  shape: 'sparkle', left: '11%', top: '55%', size: 13, color: '#f4c542', opacity: 0.60, dur: 7,  delay: 1.5, dx: -14, rs:   0, re:  72 },
  { id: 3,  shape: 'leaf',    left: '19%', top: '83%', size: 17, color: '#5a913e', opacity: 0.48, dur: 11, delay: 3,   dx:  24, rs:  55, re: 200 },
  { id: 4,  shape: 'glow',    left: '26%', top: '71%', size:  9, color: '#dff6ff', opacity: 0.65, dur: 8,  delay: 0.8, dx: -10, rs:   0, re:   0 },
  { id: 5,  shape: 'sparkle', left: '34%', top: '48%', size: 14, color: '#f4c542', opacity: 0.50, dur: 10, delay: 4,   dx:  16, rs:  20, re: 110 },
  { id: 6,  shape: 'leaf',    left: '43%', top: '87%', size: 24, color: '#7fb366', opacity: 0.42, dur: 12, delay: 1,   dx: -22, rs: 100, re: 260 },
  { id: 7,  shape: 'glow',    left: '51%', top: '63%', size:  7, color: '#5bbbe8', opacity: 0.55, dur: 7,  delay: 2,   dx:   8, rs:   0, re:   0 },
  { id: 8,  shape: 'leaf',    left: '59%', top: '77%', size: 19, color: '#5a913e', opacity: 0.50, dur: 9,  delay: 3.5, dx:  20, rs:  35, re: 175 },
  { id: 9,  shape: 'sparkle', left: '66%', top: '51%', size: 12, color: '#f4c542', opacity: 0.55, dur: 8,  delay: 0.5, dx: -18, rs:   0, re:  80 },
  { id: 10, shape: 'leaf',    left: '73%', top: '84%', size: 21, color: '#7fb366', opacity: 0.46, dur: 10, delay: 2.2, dx:  26, rs:  70, re: 220 },
  { id: 11, shape: 'glow',    left: '80%', top: '67%', size: 10, color: '#ddead7', opacity: 0.60, dur: 7,  delay: 4.5, dx: -12, rs:   0, re:   0 },
  { id: 12, shape: 'leaf',    left: '87%', top: '80%', size: 16, color: '#5a913e', opacity: 0.48, dur: 11, delay: 1.8, dx: -20, rs:  15, re: 155 },
  { id: 13, shape: 'sparkle', left: '93%', top: '45%', size: 11, color: '#f4c542', opacity: 0.52, dur: 8,  delay: 3.2, dx:  14, rs:  45, re: 135 },
  { id: 14, shape: 'leaf',    left: '8%',  top: '40%', size: 14, color: '#7fb366', opacity: 0.42, dur: 9,  delay: 5,   dx:  16, rs:   0, re: 180 },
  { id: 15, shape: 'glow',    left: '47%', top: '43%', size:  8, color: '#dff6ff', opacity: 0.50, dur: 8,  delay: 6,   dx:  -8, rs:   0, re:   0 },
  { id: 16, shape: 'leaf',    left: '76%', top: '33%', size: 20, color: '#5a913e', opacity: 0.40, dur: 12, delay: 2.7, dx: -24, rs: 130, re: 310 },
  { id: 17, shape: 'sparkle', left: '55%', top: '89%', size: 13, color: '#f4c542', opacity: 0.56, dur: 7,  delay: 1.2, dx:  12, rs:   0, re:  90 },
  { id: 18, shape: 'leaf',    left: '32%', top: '29%', size: 18, color: '#7fb366', opacity: 0.44, dur: 10, delay: 4.8, dx:  22, rs:  80, re: 240 },
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
            className="hp"
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
