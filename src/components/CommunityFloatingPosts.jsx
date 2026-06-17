import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { playMenuSound } from '../utils/menuAudio'
import { COMMUNITY_PHONE_POSITIONS, COMMUNITY_POSTS, PACK_DELAYS, positionStyle } from './communityFloatingPostsData'
import './CommunityFloatingPosts.css'

export default function CommunityFloatingPosts({ isAr = false }) {
  const [hiddenPostIds, setHiddenPostIds] = useState(() => new Set())
  const timersRef = useRef(new Map())

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const dismissPost = useCallback((post) => {
    const existingTimer = timersRef.current.get(post.id)
    if (existingTimer) {
      window.clearTimeout(existingTimer)
    } else {
      playMenuSound('community-card')
    }

    setHiddenPostIds((current) => {
      const nextHidden = new Set(current)
      nextHidden.add(post.id)
      return nextHidden
    })

    const timer = window.setTimeout(() => {
      setHiddenPostIds((current) => {
        const nextHidden = new Set(current)
        nextHidden.delete(post.id)
        return nextHidden
      })
      timersRef.current.delete(post.id)
    }, PACK_DELAYS[post.packId] ?? 6000)

    timersRef.current.set(post.id, timer)
  }, [])

  useEffect(() => {
    let lastTime = 0
    function handlePointerMove(event) {
      const now = performance.now()
      if (now - lastTime < 32) return
      lastTime = now

      const cards = document.querySelectorAll('.community-floating-card')
      for (const card of cards) {
        const rect = card.getBoundingClientRect()
        const isInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom

        if (!isInside) continue

        const post = COMMUNITY_POSTS.find((item) => item.id === card.dataset.postId)
        if (post) dismissPost(post)
        return
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [dismissPost])

  function renderLayer(layer) {
    return (
      <div className={`community-floating-posts__layer community-floating-posts__layer--${layer}`}>
        <AnimatePresence>
          {COMMUNITY_POSTS.filter((post) => post.layer === layer && !hiddenPostIds.has(post.id)).map((post, index) => {
            const floatDistance = post.layer === 'back' ? 8 : 12
            const rotationDrift = post.layer === 'back' ? 1.1 : 1.6

            return (
              <motion.button
                aria-label={isAr ? `إخفاء منشور ${post.username}` : `Hide post by ${post.usernameEn}`}
                animate={{
                  opacity: 1,
                  rotate: [post.rotation, post.rotation + rotationDrift, post.rotation - rotationDrift * 0.5, post.rotation],
                  y: [0, -floatDistance, 0],
                }}
                className={`community-floating-card community-floating-card--${post.layer}`}
                data-density={post.density}
                data-post-id={post.id}
                dir={isAr ? 'rtl' : 'ltr'}
                exit={{
                  opacity: 0,
                  scale: 0.86,
                  y: -18,
                  transition: { duration: 0.26, ease: [0.65, 0, 0.35, 1] },
                }}
                initial={{ opacity: 0, scale: 0.92, y: 14, rotate: post.rotation }}
                key={post.id}
                lang={isAr ? 'ar' : 'en'}
                onClick={() => dismissPost(post)}
                onFocus={() => dismissPost(post)}
                onMouseEnter={() => dismissPost(post)}
                onPointerEnter={() => dismissPost(post)}
                style={positionStyle(COMMUNITY_PHONE_POSITIONS[post.id] ?? post.position, isAr)}
                transition={{
                  opacity: { duration: 0.36, ease: 'easeOut' },
                  scale: { duration: 0.36, ease: 'easeOut' },
                  y: {
                    delay: index * 0.18,
                    duration: 6.8 + (index % 3) * 0.7,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  },
                  rotate: {
                    delay: index * 0.18,
                    duration: 7.4 + (index % 4) * 0.6,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  },
                }}
                type="button"
                whileTap={{ scale: 0.96 }}
              >
                <span className="community-floating-card__header">
                  <span className="community-floating-card__identity">
                    <img alt="" aria-hidden="true" className="community-floating-card__avatar" src={post.avatar} />
                    <span className="community-floating-card__user">{isAr ? post.username : post.usernameEn}</span>
                  </span>
                  <span className="community-floating-card__icon" aria-hidden="true" style={{ '--badge-bg': post.iconBg }}>{post.icon}</span>
                </span>
                <span className="community-floating-card__text">{isAr ? post.text : post.textEn}</span>
                <span className="community-floating-card__footer" aria-hidden="true">
                  <span>{post.likes} {isAr ? 'إعجاب' : 'likes'}</span>
                  <span>{post.comments} {isAr ? 'تعليق' : 'comments'}</span>
                </span>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className={`community-floating-posts ${isAr ? 'community-floating-posts--ar' : 'community-floating-posts--en'}`} aria-hidden="false">
      {renderLayer('back')}
      {renderLayer('front')}
    </div>
  )
}
