import { motion } from 'framer-motion'
import './FunTitleReveal.css'

const wordReveal = {
  hidden: {
    opacity: 0,
    y: '0.85em',
    rotate: -2.5,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 470,
      damping: 22,
      mass: 0.72,
    },
  },
}

export default function FunTitleReveal({
  amount = 0.5,
  className,
  delay = 0,
  text,
}) {
  const tokens = String(text ?? '').split(/(\s+)/).filter(Boolean)

  return (
    <motion.span
      className={['fun-title-reveal', className].filter(Boolean).join(' ')}
      initial="hidden"
      viewport={{ once: true, amount }}
      whileInView="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.075,
          },
        },
      }}
    >
      {tokens.map((token, index) => (
        /^\s+$/.test(token) ? (
          <span className="fun-title-reveal__space" key={`space-${index}`}>
            {token}
          </span>
        ) : (
          <motion.span
            className="fun-title-reveal__word"
            key={`word-${index}`}
            variants={wordReveal}
          >
            {token}
          </motion.span>
        )
      ))}
    </motion.span>
  )
}
