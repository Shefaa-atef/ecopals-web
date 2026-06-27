const NATURE_ICONS = [
  {
    id: 'leaf',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M9 35 C9 35 11 21 23 13 C35 5 39 7 39 7 C39 7 37 21 25 29 C13 37 9 35 9 35Z" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M9 35 L23 21" stroke="var(--ink-brown)" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'drop',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 5 C22 5 8 22 8 29 C8 37 14.4 41 22 41 C29.6 41 36 37 36 29 C36 22 22 5 22 5Z" fill="var(--ocean-blue)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M16 30 C16 25.5 18.5 23 22 23" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: 'star',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 5 L26.5 16.5 L39 16.5 L29 24 L32.5 36 L22 28.5 L11.5 36 L15 24 L5 16.5 L17.5 16.5 Z" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'flower',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="13" rx="6" ry="9" fill="var(--lavender)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <ellipse cx="22" cy="31" rx="6" ry="9" fill="var(--lavender)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <ellipse cx="13" cy="22" rx="9" ry="6" fill="var(--lavender)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <ellipse cx="31" cy="22" rx="9" ry="6" fill="var(--lavender)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="7.5" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: 'sun',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="9" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2"/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          const x1 = 22 + 13 * Math.cos(rad)
          const y1 = 22 + 13 * Math.sin(rad)
          const x2 = 22 + 18 * Math.cos(rad)
          const y2 = 22 + 18 * Math.sin(rad)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        })}
      </svg>
    ),
  },
  {
    id: 'butterfly',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 22 C18 14 6 10 7 18 C8 26 18 26 22 22Z" fill="var(--soft-berry)" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M22 22 C26 14 38 10 37 18 C36 26 26 26 22 22Z" fill="var(--soft-berry)" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M22 22 C19 28 10 30 11 36 C12 40 20 36 22 22Z" fill="var(--lavender)" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M22 22 C25 28 34 30 33 36 C32 40 24 36 22 22Z" fill="var(--lavender)" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="22" y1="10" x2="18" y2="6" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="22" y1="10" x2="26" y2="6" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round"/>
        <ellipse cx="22" cy="21" rx="2" ry="11" fill="var(--ink-brown)"/>
      </svg>
    ),
  },
  {
    id: 'cloud',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M10 30 C6 30 4 27 4 24 C4 21 6.5 18.5 10 18.5 C10 14 13.5 11 18 11 C21 11 23.5 12.5 25 15 C26 14.5 27.2 14.2 28.5 14.2 C32.6 14.2 36 17.4 36 21.3 C38 22 40 24 40 26.5 C40 29 37.5 31 34.5 31 Z" fill="var(--light-aqua)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'heart',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 37 C22 37 5 26 5 15.5 C5 10.5 9 7 13.5 7 C17 7 20 9 22 12 C24 9 27 7 30.5 7 C35 7 39 10.5 39 15.5 C39 26 22 37 22 37Z" fill="var(--berry-pink)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M14 15 C14 13 16 11.5 18 12" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
  {
    id: 'sprout',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <line x1="22" y1="38" x2="22" y2="18" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M22 26 C22 26 14 24 12 16 C12 16 20 13 26 18 C28 20 27 24 22 26Z" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M22 20 C22 20 28 16 36 18 C36 18 35 26 28 27 C24 27.5 22 24 22 20Z" fill="#9fd17a" stroke="var(--ink-brown)" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

const FACE_ICONS = [
  {
    id: 'face-happy',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <circle cx="16" cy="19" r="2.5" fill="var(--ink-brown)"/>
        <circle cx="28" cy="19" r="2.5" fill="var(--ink-brown)"/>
        <circle cx="16.8" cy="18.2" r="0.9" fill="white" opacity="0.7"/>
        <circle cx="28.8" cy="18.2" r="0.9" fill="white" opacity="0.7"/>
        <path d="M14 26 C16 32 28 32 30 26" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'face-angry',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="var(--berry-pink)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <path d="M12 15 L19 18.5" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M32 15 L25 18.5" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="16" cy="21" r="2.5" fill="var(--ink-brown)"/>
        <circle cx="28" cy="21" r="2.5" fill="var(--ink-brown)"/>
        <path d="M15 30 C18 26 26 26 29 30" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'face-love',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="var(--soft-berry)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <path d="M16 20 C16 20 13 17 14.5 15.5 C15.2 14.7 16 15.2 16 16.2 C16 15.2 16.8 14.7 17.5 15.5 C19 17 16 20 16 20Z" fill="var(--berry-pink)" stroke="var(--ink-brown)" strokeWidth="1"/>
        <path d="M28 20 C28 20 25 17 26.5 15.5 C27.2 14.7 28 15.2 28 16.2 C28 15.2 28.8 14.7 29.5 15.5 C31 17 28 20 28 20Z" fill="var(--berry-pink)" stroke="var(--ink-brown)" strokeWidth="1"/>
        <path d="M14 27 C16 33 28 33 30 27" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'face-sad',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="var(--light-aqua)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <circle cx="16" cy="18" r="2.5" fill="var(--ink-brown)"/>
        <circle cx="28" cy="18" r="2.5" fill="var(--ink-brown)"/>
        <path d="M16 22 C15.5 25 14.8 27.5 15.2 29 C15.6 30.5 17.4 30.5 17.8 29 C18.2 27.5 17.5 25 16 22Z" fill="var(--ocean-blue)" stroke="var(--ink-brown)" strokeWidth="1"/>
        <path d="M15 31 C17 26 27 26 29 31" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'face-surprised',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <circle cx="16" cy="17" r="4" fill="white" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <circle cx="28" cy="17" r="4" fill="white" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <circle cx="16" cy="17" r="2" fill="var(--ink-brown)"/>
        <circle cx="28" cy="17" r="2" fill="var(--ink-brown)"/>
        <ellipse cx="22" cy="30" rx="4.5" ry="5" fill="var(--ink-brown)" stroke="var(--ink-brown)" strokeWidth="1"/>
        <ellipse cx="22" cy="30" rx="2.5" ry="3" fill="var(--berry-pink)"/>
      </svg>
    ),
  },
  {
    id: 'face-laugh',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <path d="M12.5 18.5 C14 16.5 18 16.5 19.5 18.5" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M24.5 18.5 C26 16.5 30 16.5 31.5 18.5" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M12 25 C12 34 32 34 32 25 Z" fill="var(--ink-brown)"/>
        <line x1="12" y1="25" x2="32" y2="25" stroke="white" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    id: 'face-wink',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <path d="M13 18.5 C14.5 16.5 17.5 16.5 19 18.5" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="28" cy="18.5" r="2.5" fill="var(--ink-brown)"/>
        <circle cx="28.8" cy="17.7" r="0.9" fill="white" opacity="0.7"/>
        <circle cx="31" cy="23" r="3.5" fill="var(--berry-pink)" opacity="0.35"/>
        <path d="M14 27 C16 32 28 32 30 27" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'face-cool',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <rect x="9" y="16" width="11" height="8" rx="3" fill="var(--ink-brown)"/>
        <rect x="24" y="16" width="11" height="8" rx="3" fill="var(--ink-brown)"/>
        <line x1="20" y1="20" x2="24" y2="20" stroke="var(--ink-brown)" strokeWidth="2"/>
        <line x1="9" y1="20" x2="5" y2="19" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="35" y1="20" x2="39" y2="19" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 29 C17 34 27 34 29 29" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'face-sleepy',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="var(--light-aqua)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <path d="M12.5 19.5 C14 17.5 18 17.5 19.5 19.5" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="12.5" y1="19.5" x2="19.5" y2="19.5" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M24.5 19.5 C26 17.5 30 17.5 31.5 19.5" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="24.5" y1="19.5" x2="31.5" y2="19.5" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M18 29 C19.5 31 24.5 31 26 29" stroke="var(--ink-brown)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M29 12 L33 12 L29 9 L34 9" stroke="var(--lavender)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M33 8 L36 8 L33 6 L37 6" stroke="var(--lavender)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

const COMM_ICONS = [
  {
    id: 'comm-chat',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M6 8 C6 6 7.5 4 10 4 L34 4 C36.5 4 38 6 38 8 L38 24 C38 26 36.5 28 34 28 L16 28 L8 38 L8 28 C7 28 6 27 6 26 Z" fill="var(--lavender)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <line x1="13" y1="13" x2="31" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <line x1="13" y1="19" x2="25" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      </svg>
    ),
  },
  {
    id: 'comm-envelope',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="4" y="10" width="36" height="26" rx="3" fill="var(--ocean-blue)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <path d="M4 10 L22 24 L40 10" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'comm-phone',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="12" y="4" width="20" height="36" rx="4" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <rect x="14" y="8" width="16" height="22" rx="2" fill="var(--light-aqua)"/>
        <circle cx="22" cy="35" r="2.5" fill="var(--ink-brown)" opacity="0.4"/>
      </svg>
    ),
  },
  {
    id: 'comm-megaphone',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M8 17 L8 27 L15 27 L30 37 L30 7 L15 17 Z" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <line x1="15" y1="17" x2="15" y2="27" stroke="var(--ink-brown)" strokeWidth="2"/>
        <path d="M34 15 C37 17.5 39 20 39 22 C39 24 37 26.5 34 29" stroke="var(--ink-brown)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M34 18.5 C35.5 19.8 36.5 20.8 36.5 22 C36.5 23.2 35.5 24.2 34 25.5" stroke="var(--ink-brown)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'comm-bell',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 5 L22 8 C16 8 11 13 11 20 L11 28 L33 28 L33 20 C33 13 28 8 22 8 Z" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M8 28 L36 28" stroke="var(--ink-brown)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M19 28 C19 31.3 25 31.3 25 28" stroke="var(--ink-brown)" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="31" cy="10" r="5" fill="var(--berry-pink)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'comm-wifi',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="36" r="3" fill="var(--ink-brown)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <path d="M14.5 28 C16.5 24.5 19.5 22.5 22 22.5 C24.5 22.5 27.5 24.5 29.5 28" stroke="var(--sky-cyan)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M8.5 22 C12.5 15.5 17.5 12 22 12 C26.5 12 31.5 15.5 35.5 22" stroke="var(--ocean-blue)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M3 16 C8.5 7 15 3.5 22 3.5 C29 3.5 35.5 7 41 16" stroke="var(--lavender)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'comm-send',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M5 22 L39 7 L26 39 L21 27 Z" fill="var(--ocean-blue)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <line x1="21" y1="27" x2="39" y2="7" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'comm-globe',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="17" fill="var(--ocean-blue)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <ellipse cx="22" cy="22" rx="8" ry="17" fill="none" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <line x1="5" y1="22" x2="39" y2="22" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 15 L37 15" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M7 29 L37 29" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: 'comm-signal',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="4" y="30" width="7" height="8" rx="1.5" fill="var(--sky-cyan)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <rect x="14" y="23" width="7" height="15" rx="1.5" fill="var(--ocean-blue)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <rect x="24" y="15" width="7" height="23" rx="1.5" fill="var(--lavender)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <rect x="34" y="8" width="7" height="30" rx="1.5" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
      </svg>
    ),
  },
]

const RECYCLE_ICONS = [
  {
    id: 'recycle-bin',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="11" y="17" width="22" height="22" rx="3" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <rect x="8" y="13" width="28" height="6" rx="2" fill="#9fd17a" stroke="var(--ink-brown)" strokeWidth="2"/>
        <rect x="17" y="8" width="10" height="6" rx="2" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <line x1="17" y1="23" x2="17" y2="33" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
        <line x1="22" y1="23" x2="22" y2="33" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
        <line x1="27" y1="23" x2="27" y2="33" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: 'recycle-bottle',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="18" y="4" width="8" height="5" rx="2" fill="#9fd17a" stroke="var(--ink-brown)" strokeWidth="1.8"/>
        <path d="M16 10 C13 13 12 16 12 20 L12 36 C12 38.5 14 40 16.5 40 L27.5 40 C30 40 32 38.5 32 36 L32 20 C32 16 31 13 28 10 Z" fill="var(--light-aqua)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="14" y="21" width="16" height="11" rx="2" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <path d="M19 25 L22 22.5 L25 25" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="22" y1="22.5" x2="22" y2="29" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M19 29 L22 31.5 L25 29" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'recycle-can',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="13" y="14" width="18" height="24" rx="1" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <ellipse cx="22" cy="14" rx="9" ry="3.5" fill="#9fd17a" stroke="var(--ink-brown)" strokeWidth="2"/>
        <ellipse cx="22" cy="38" rx="9" ry="3.5" fill="#9fd17a" stroke="var(--ink-brown)" strokeWidth="2"/>
        <line x1="22" y1="10.5" x2="26" y2="14" stroke="var(--ink-brown)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24.5" cy="10" r="2" fill="#9fd17a" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <line x1="16" y1="20" x2="28" y2="20" stroke="var(--ink-brown)" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
        <line x1="16" y1="26" x2="28" y2="26" stroke="var(--ink-brown)" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
        <line x1="16" y1="32" x2="28" y2="32" stroke="var(--ink-brown)" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
  {
    id: 'recycle-paper',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M9 7 L29 7 L35 13 L35 38 C35 39.5 34 41 33 41 L11 41 C10 41 9 39.5 9 38 Z" fill="white" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M29 7 L29 13 L35 13 Z" fill="var(--light-aqua)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <line x1="14" y1="21" x2="30" y2="21" stroke="var(--ink-brown)" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="14" y1="27" x2="30" y2="27" stroke="var(--ink-brown)" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="14" y1="33" x2="22" y2="33" stroke="var(--ink-brown)" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <path d="M27 35 C27 35 24 33 24 30 C24 30 27 29.5 28.5 31.5 C29 32.5 28.5 34 27 35Z" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="27" y1="35" x2="27" y2="29" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'recycle-arrows',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 9 A13 13 0 0 1 33 29" stroke="var(--ink-brown)" strokeWidth="7.5" strokeLinecap="butt" fill="none"/>
        <path d="M33 29 A13 13 0 0 1 11 29" stroke="var(--ink-brown)" strokeWidth="7.5" strokeLinecap="butt" fill="none"/>
        <path d="M11 29 A13 13 0 0 1 22 9" stroke="var(--ink-brown)" strokeWidth="7.5" strokeLinecap="butt" fill="none"/>
        <path d="M22 9 A13 13 0 0 1 33 29" stroke="var(--fresh-leaf)" strokeWidth="5.5" strokeLinecap="butt" fill="none"/>
        <path d="M33 29 A13 13 0 0 1 11 29" stroke="#9fd17a" strokeWidth="5.5" strokeLinecap="butt" fill="none"/>
        <path d="M11 29 A13 13 0 0 1 22 9" stroke="var(--ocean-blue)" strokeWidth="5.5" strokeLinecap="butt" fill="none"/>
        <polygon points="33,29 33,33 29,31" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinejoin="round"/>
        <polygon points="11,29 7,27 11,25" fill="#9fd17a" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinejoin="round"/>
        <polygon points="22,9 26,7 26,11" fill="var(--ocean-blue)" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'recycle-bag',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M10 18 L8 38 C8 39.5 9 41 10.5 41 L33.5 41 C35 41 36 39.5 36 38 L34 18 Z" fill="var(--lavender)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M16 18 C16 13 18 9 22 9 C26 9 28 13 28 18" stroke="var(--ink-brown)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M15 28 C18 25 26 25 29 28" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7"/>
        <line x1="22" y1="9" x2="22" y2="5" stroke="var(--ink-brown)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 5 L22 3 L25 5" stroke="var(--fresh-leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'recycle-compost',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M10 22 L12 38 C12 39.5 13.5 41 15 41 L29 41 C30.5 41 32 39.5 32 38 L34 22 Z" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="8" y="18" width="28" height="6" rx="2" fill="#9fd17a" stroke="var(--ink-brown)" strokeWidth="2"/>
        <line x1="22" y1="18" x2="22" y2="7" stroke="var(--ink-brown)" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M22 14 C22 14 15 12 14 6 C14 6 21 5 24 10 C25 11.5 24 14 22 14Z" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M22 11 C22 11 28 8 33 10 C33 10 31 16 26 16 C24 16 22 14 22 11Z" fill="#9fd17a" stroke="var(--ink-brown)" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'recycle-jar',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="16" y="4" width="12" height="7" rx="2" fill="var(--light-aqua)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <path d="M13 12 L12 37 C12 39 13.5 41 15.5 41 L28.5 41 C30.5 41 32 39 32 37 L31 12 Z" fill="var(--light-aqua)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <ellipse cx="22" cy="12" rx="9" ry="3" fill="var(--light-aqua)" stroke="var(--ink-brown)" strokeWidth="1.5"/>
        <path d="M14 30 Q22 25 30 30 L30 38 Q22 36 14 38 Z" fill="var(--fresh-leaf)" opacity="0.5"/>
        <path d="M15 16 C15 14 17 13 18 14" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      </svg>
    ),
  },
]

const MONEY_ICONS = [
  {
    id: 'money-coin',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="#f5c518" stroke="#7c4a00" strokeWidth="2.5"/>
        <circle cx="22" cy="22" r="13.5" fill="#ffd84d" stroke="#7c4a00" strokeWidth="1.8"/>
        <path d="M15 17 C17 14 27 14 29 17" stroke="#7c4a00" strokeWidth="1.6" strokeLinecap="round" opacity="0.45"/>
        <circle cx="17" cy="20" r="1.2" fill="#7c4a00" opacity="0.3"/>
        <circle cx="27" cy="20" r="1.2" fill="#7c4a00" opacity="0.3"/>
      </svg>
    ),
  },
  {
    id: 'money-stack',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="36" rx="14" ry="4.5" fill="#a87000" stroke="#7c4a00" strokeWidth="1.8"/>
        <rect x="8" y="10" width="28" height="26" fill="#e8a800"/>
        <line x1="8" y1="10" x2="8" y2="36" stroke="#7c4a00" strokeWidth="1.8"/>
        <line x1="36" y1="10" x2="36" y2="36" stroke="#7c4a00" strokeWidth="1.8"/>
        <line x1="8" y1="19.5" x2="36" y2="19.5" stroke="#c88a00" strokeWidth="1.8"/>
        <line x1="8" y1="28" x2="36" y2="28" stroke="#c88a00" strokeWidth="1.8"/>
        <ellipse cx="22" cy="10" rx="14" ry="4.5" fill="#fde862" stroke="#7c4a00" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    id: 'money-bill',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="4" y="13" width="36" height="20" rx="3" fill="#5db85d" stroke="#7c4a00" strokeWidth="2"/>
        <rect x="9" y="18" width="26" height="10" rx="2" fill="#7acc7a" stroke="#7c4a00" strokeWidth="1.4"/>
        <circle cx="22" cy="23" r="5" fill="#f5c518" stroke="#7c4a00" strokeWidth="1.6"/>
        <circle cx="22" cy="23" r="2.5" fill="#ffd84d" stroke="#7c4a00" strokeWidth="1.2"/>
        <line x1="6" y1="20" x2="6" y2="26" stroke="#7c4a00" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <line x1="38" y1="20" x2="38" y2="26" stroke="#7c4a00" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
  {
    id: 'money-bag',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M17 10 L14 5 L30 5 L27 10 Z" fill="#cda352" stroke="#7c4a00" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M16 10 L28 10 C34 15 38 24 38 31 C38 38 32 41 22 41 C12 41 6 38 6 31 C6 24 10 15 16 10Z" fill="#f5c518" stroke="#7c4a00" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M15 14 L29 14" stroke="#7c4a00" strokeWidth="2" strokeLinecap="round"/>
        <path d="M13 28 C13 22 31 22 31 28" stroke="#7c4a00" strokeWidth="1.6" strokeLinecap="round" opacity="0.4"/>
        <path d="M11 33 C11 27 33 27 33 33" stroke="#7c4a00" strokeWidth="1.6" strokeLinecap="round" opacity="0.25"/>
      </svg>
    ),
  },
  {
    id: 'money-wallet',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M7 14 C7 11.5 9 10 11.5 10 L31 10 C33 10 35 11.5 35 14 L35 17 L9 17 C7.8 17 7 16 7 14Z" fill="#8ccf68" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="6" y="16" width="32" height="21" rx="4" fill="var(--fresh-leaf)" stroke="var(--ink-brown)" strokeWidth="2"/>
        <path d="M27 22 L39 22 L39 31 L27 31 C24.5 31 23 29.4 23 26.5 C23 23.6 24.5 22 27 22Z" fill="var(--golden-yellow)" stroke="var(--ink-brown)" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="28.5" cy="26.5" r="2" fill="var(--ink-brown)"/>
        <path d="M12 13 C15 11.5 20 11.5 23 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>
      </svg>
    ),
  },
]

export const ICON_SETS = [NATURE_ICONS, FACE_ICONS, COMM_ICONS, RECYCLE_ICONS, MONEY_ICONS]

export const SECTION_TO_SET = {
  home: 0,
  game: 1,
  community: 2,
  challenges: 3,
  'recycle-portal': 4,
  'clothing-game': 1,
  'match-3-game': 1,
}
