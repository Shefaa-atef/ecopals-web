export const menuColorLayers = [
  'var(--challenge-water)',
  'var(--challenge-community)',
  'var(--challenge-energy)',
  'var(--challenge-plants)',
]

export const menuPanel = {
  initial: {
    clipPath: 'circle(0% at calc(100% - 42px) 0%)',
    filter: 'blur(12px)',
    opacity: 0,
    scale: 0.94,
  },
  enter: {
    clipPath: 'circle(145% at calc(100% - 42px) 0%)',
    filter: 'blur(0px)',
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 185,
      damping: 19,
      mass: 0.68,
      staggerChildren: 0.075,
      delay: 0.16,
      delayChildren: 0.22,
    },
  },
  exit: {
    clipPath: 'circle(0% at calc(100% - 42px) 0%)',
    filter: 'blur(10px)',
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.34, ease: [0.76, 0, 0.24, 1] },
  },
}

export const menuLink = {
  initial: { opacity: 0, x: 42, y: 18, rotate: -2.5, scale: 0.94 },
  enter: (index) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 360,
      damping: 22,
      mass: 0.65,
      delay: index * 0.018,
    },
  }),
  exit: { opacity: 0, x: 24, y: 10, scale: 0.98, transition: { duration: 0.16 } },
}

export const menuColorLayer = {
  initial: {
    clipPath: 'circle(0% at calc(100% - 38px) 0%)',
    opacity: 0,
    scale: 0.96,
    x: 0,
    y: -10,
    rotate: 0,
  },
  enter: (index) => ({
    clipPath: 'circle(145% at calc(100% - 38px) 0%)',
    opacity: [0, 0.86 - index * 0.08, 0],
    scale: [0.96, 1.015, 1],
    x: 0,
    y: [-10, (index + 1) * 4, 0],
    rotate: [0, index % 2 === 0 ? -0.18 : 0.18, 0],
    transition: {
      clipPath: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: index * 0.055 },
      opacity: { duration: 0.72, ease: 'easeOut', times: [0, 0.38, 1], delay: index * 0.055 },
      x: { type: 'spring', stiffness: 260, damping: 24, delay: index * 0.055 },
      y: { duration: 0.72, ease: [0.16, 1, 0.3, 1], times: [0, 0.42, 1], delay: index * 0.055 },
      rotate: { duration: 0.48, ease: 'easeOut', delay: index * 0.055 },
      scale: { duration: 0.72, ease: [0.16, 1, 0.3, 1], times: [0, 0.42, 1], delay: index * 0.055 },
    },
  }),
  exit: (index) => ({
    clipPath: 'circle(0% at calc(100% - 38px) 0%)',
    opacity: 0,
    scale: 0.96,
    x: 0,
    y: -10,
    rotate: 0,
    transition: {
      duration: 0.28,
      delay: (menuColorLayers.length - index - 1) * 0.035,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
}
