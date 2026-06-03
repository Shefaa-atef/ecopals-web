import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import earthieAvatarUrl from '../assets/logo@4x.png'
import './CommunityFloatingPosts.css'

const PACK_DELAYS = {
  1: 4000,
  2: 6000,
  3: 8000,
}

const COMMUNITY_POSTS = [
  {
    id: 'garden-water-saved',
    username: 'ليان',
    text: 'سقينا حديقة المدرسة بمياه معاد استخدامها اليوم. الفريق كله شارك!',
    likes: 128,
    comments: 18,
    avatar: earthieAvatarUrl,
    icon: '💧',
    position: { top: '7%', left: '5%' },
    rotation: -5,
    layer: 'back',
    packId: 1,
    density: 'tablet',
  },
  {
    id: 'tree-challenge-started',
    username: 'عمر',
    text: 'بدأنا تحدي زراعة 20 شتلة في الحي. من يريد الانضمام؟',
    likes: 92,
    comments: 11,
    avatar: earthieAvatarUrl,
    icon: '🌱',
    position: { top: '12%', left: '42%' },
    rotation: 4,
    layer: 'back',
    packId: 2,
    density: 'tablet',
  },
  {
    id: 'cleanup-progress',
    username: 'سارة',
    text: 'نظفنا جزء من الشاطئ وجمعنا 14 كيس نفايات. فخورين فيكم!',
    likes: 176,
    comments: 27,
    avatar: earthieAvatarUrl,
    icon: '♻️',
    position: { top: '8%', right: '7%' },
    rotation: 6,
    layer: 'back',
    packId: 3,
    density: 'tablet',
  },
  {
    id: 'bike-to-school',
    username: 'يزن',
    text: 'رحت على المدرسة بالدراجة بدل السيارة. 3 أيام متتالية!',
    likes: 77,
    comments: 9,
    avatar: earthieAvatarUrl,
    icon: '🚲',
    position: { top: '37%', left: '2%' },
    rotation: 3,
    layer: 'back',
    packId: 2,
    density: 'desktop',
  },
  {
    id: 'recycling-bin-alert',
    username: 'نور',
    text: 'في حاوية تدوير جديدة جنب النادي. خلونا نستخدمها صح.',
    likes: 61,
    comments: 7,
    avatar: earthieAvatarUrl,
    icon: '🗑️',
    position: { top: '48%', left: '44%' },
    rotation: -4,
    layer: 'back',
    packId: 1,
    density: 'mobile',
  },
  {
    id: 'solar-roof-win',
    username: 'مالك',
    text: 'ركبنا ألواح شمسية صغيرة للنادي البيئي. أول نتيجة: إضاءة الحديقة!',
    likes: 143,
    comments: 20,
    avatar: earthieAvatarUrl,
    icon: '☀️',
    position: { bottom: '9%', right: '6%' },
    rotation: -6,
    layer: 'back',
    packId: 3,
    density: 'desktop',
  },
  {
    id: 'plant-swap',
    username: 'جنى',
    text: 'تبادلنا نباتات بدل شراء جديد. عندي ريحان زيادة إذا حدا بده.',
    likes: 84,
    comments: 13,
    avatar: earthieAvatarUrl,
    icon: '🪴',
    position: { bottom: '8%', left: '18%' },
    rotation: 5,
    layer: 'back',
    packId: 1,
    density: 'tablet',
  },
  {
    id: 'air-quality-report',
    username: 'آدم',
    text: 'بلغنا عن دخان كثيف قرب الملعب. صحة الأطفال أهم.',
    likes: 109,
    comments: 16,
    avatar: earthieAvatarUrl,
    icon: '🌬️',
    position: { top: '40%', right: '15%' },
    rotation: 3,
    layer: 'back',
    packId: 2,
    density: 'desktop',
  },
  {
    id: 'seed-bank',
    username: 'هند',
    text: 'فتحنا صندوق بذور صغير في الحي. كل واحد يأخذ بذور ويترك بذور.',
    likes: 73,
    comments: 8,
    avatar: earthieAvatarUrl,
    icon: '🌾',
    position: { top: '22%', left: '15%' },
    rotation: 6,
    layer: 'back',
    packId: 1,
    density: 'desktop',
  },
  {
    id: 'school-points',
    username: 'سليم',
    text: 'صفنا جمع 420 نقطة من تحديات الأسبوع. المنافسة حماس!',
    likes: 132,
    comments: 21,
    avatar: earthieAvatarUrl,
    icon: '⭐',
    position: { top: '58%', right: '36%' },
    rotation: -3,
    layer: 'back',
    packId: 3,
    density: 'desktop',
  },
  {
    id: 'reuse-jars',
    username: 'فرح',
    text: 'حوّلنا المرطبانات القديمة لأصص نباتات صغيرة للمطبخ.',
    likes: 58,
    comments: 5,
    avatar: earthieAvatarUrl,
    icon: '🫙',
    position: { bottom: '3%', left: '41%' },
    rotation: 2,
    layer: 'back',
    packId: 2,
    density: 'tablet',
  },
  {
    id: 'lights-off',
    username: 'راشد',
    text: 'اتفقنا نطفّي أضواء الصف وقت الاستراحة. عادة بسيطة وفرق واضح.',
    likes: 88,
    comments: 10,
    avatar: earthieAvatarUrl,
    icon: '💡',
    position: { top: '4%', left: '66%' },
    rotation: -5,
    layer: 'back',
    packId: 3,
    density: 'desktop',
  },
  {
    id: 'front-compost',
    username: 'تالا',
    text: 'صندوق السماد في البيت صار يعطي تربة ممتازة للنباتات.',
    likes: 68,
    comments: 6,
    avatar: earthieAvatarUrl,
    icon: '🍃',
    position: { top: '22%', left: '30%' },
    rotation: -3,
    layer: 'front',
    packId: 3,
    density: 'tablet',
  },
  {
    id: 'front-group-photo',
    username: 'لمى',
    text: 'نزلنا صورة قبل وبعد تنظيف الساحة. الفرق يفتح النفس.',
    likes: 147,
    comments: 22,
    avatar: earthieAvatarUrl,
    icon: '📸',
    position: { top: '14%', right: '40%' },
    rotation: -4,
    layer: 'front',
    packId: 2,
    density: 'desktop',
  },
  {
    id: 'front-bottle-count',
    username: 'كريم',
    text: 'جمعنا 230 عبوة بلاستيك من الصفوف خلال أسبوع واحد.',
    likes: 155,
    comments: 24,
    avatar: earthieAvatarUrl,
    icon: '♻️',
    position: { top: '25%', right: '27%' },
    rotation: 5,
    layer: 'front',
    packId: 1,
    density: 'desktop',
  },
  {
    id: 'front-market-bags',
    username: 'نادر',
    text: 'وزعنا أكياس قماش في السوق بدل البلاستيك. الناس تفاعلت معنا.',
    likes: 112,
    comments: 17,
    avatar: earthieAvatarUrl,
    icon: '🛍️',
    position: { top: '63%', left: '23%' },
    rotation: -5,
    layer: 'front',
    packId: 1,
    density: 'desktop',
  },
  {
    id: 'front-group-walk',
    username: 'ميرا',
    text: 'مشي جماعي صباح الجمعة بدون سيارات. الجو كان رائع!',
    likes: 96,
    comments: 14,
    avatar: earthieAvatarUrl,
    icon: '🌿',
    position: { bottom: '12%', left: '6%' },
    rotation: 4,
    layer: 'front',
    packId: 2,
    density: 'mobile',
  },
  {
    id: 'front-compost-team',
    username: 'شهد',
    text: 'فريق الكومبوست صار عنده 16 مشارك. مين يدخل معنا؟',
    likes: 101,
    comments: 15,
    avatar: earthieAvatarUrl,
    icon: '🪱',
    position: { bottom: '5%', right: '43%' },
    rotation: 3,
    layer: 'front',
    packId: 3,
    density: 'desktop',
  },
  {
    id: 'front-water-challenge',
    username: 'رنا',
    text: 'أنهيت تحدي توفير الماء 5 أيام. إيرثي صار مبسوط!',
    likes: 121,
    comments: 19,
    avatar: earthieAvatarUrl,
    icon: '💚',
    position: { bottom: '17%', right: '25%' },
    rotation: -5,
    layer: 'front',
    packId: 3,
    density: 'desktop',
  },
  {
    id: 'front-cup-reuse',
    username: 'جود',
    text: 'جبنا أكوابنا معنا اليوم بدل الأكواب البلاستيك. عادة صغيرة وفرق كبير.',
    likes: 116,
    comments: 12,
    avatar: earthieAvatarUrl,
    icon: '☕',
    position: { bottom: '8%', right: '16%' },
    rotation: 4,
    layer: 'front',
    packId: 1,
    density: 'desktop',
  },
  {
    id: 'front-bus-team',
    username: 'نور',
    text: 'اتفقنا نروح بالباص يومين بالأسبوع ونخفف سيارات قدام المدرسة.',
    likes: 138,
    comments: 18,
    avatar: earthieAvatarUrl,
    icon: '🚌',
    position: { bottom: '1%', right: '18%' },
    rotation: -3,
    layer: 'front',
    packId: 2,
    density: 'desktop',
  },
  {
    id: 'back-lunch-boxes',
    username: 'هيا',
    text: 'تحدي علب الطعام القابلة لإعادة الاستخدام بدأ اليوم. مين معنا؟',
    likes: 104,
    comments: 13,
    avatar: earthieAvatarUrl,
    icon: '🥗',
    position: { bottom: '10%', right: '31%' },
    rotation: 5,
    layer: 'back',
    packId: 3,
    density: 'desktop',
  },
  {
    id: 'back-phone-right-bottom',
    username: 'سيف',
    text: 'ركبنا لوحة تذكير قرب الحنفية: سكّر الماء بعد الاستخدام.',
    likes: 119,
    comments: 16,
    avatar: earthieAvatarUrl,
    icon: '🚰',
    position: { bottom: '2%', right: '4%' },
    rotation: 3,
    layer: 'back',
    packId: 1,
    density: 'desktop',
  },
]

const COMMUNITY_PHONE_POSITIONS = {
  'garden-water-saved': { top: '5%', right: '28%' },
  'tree-challenge-started': { top: '10%', right: '8%' },
  'cleanup-progress': { top: '27%', right: '4%' },
  'bike-to-school': { top: '44%', right: '32%' },
  'recycling-bin-alert': { bottom: '15%', right: '23%' },
  'solar-roof-win': { bottom: '6%', right: '5%' },
  'plant-swap': { bottom: '5%', right: '34%' },
  'air-quality-report': { top: '39%', right: '7%' },
  'seed-bank': { top: '18%', right: '34%' },
  'school-points': { top: '57%', right: '30%' },
  'reuse-jars': { bottom: '20%', right: '38%' },
  'lights-off': { top: '3%', right: '38%' },
  'front-compost': { top: '21%', right: '25%' },
  'front-group-photo': { top: '12%', right: '17%' },
  'front-bottle-count': { top: '31%', right: '19%' },
  'front-market-bags': { top: '63%', right: '21%' },
  'front-group-walk': { bottom: '12%', right: '42%' },
  'front-compost-team': { bottom: '5%', right: '27%' },
  'front-water-challenge': { bottom: '20%', right: '13%' },
  'front-cup-reuse': { bottom: '2%', right: '15%' },
  'front-bus-team': { bottom: '12%', right: '2%' },
  'back-lunch-boxes': { bottom: '9%', right: '31%' },
  'back-phone-right-bottom': { bottom: '0%', right: '4%' },
}

function positionStyle(position, isAr) {
  const nextPosition = isAr
    ? Object.entries(position).reduce((style, [key, value]) => {
      if (key === 'left') {
        style.right = value
        return style
      }

      if (key === 'right') {
        style.left = value
        return style
      }

      style[key] = value
      return style
    }, {})
    : position

  return Object.entries(nextPosition).reduce((style, [key, value]) => {
    style[key] = value
    return style
  }, {})
}

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
    function handlePointerMove(event) {
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
                aria-label={`إخفاء منشور ${post.username}`}
                animate={{
                  opacity: 1,
                  rotate: [post.rotation, post.rotation + rotationDrift, post.rotation - rotationDrift * 0.5, post.rotation],
                  y: [0, -floatDistance, 0],
                }}
                className={`community-floating-card community-floating-card--${post.layer}`}
                data-density={post.density}
                data-post-id={post.id}
                dir="rtl"
                exit={{
                  opacity: 0,
                  scale: 0.86,
                  y: -18,
                  transition: { duration: 0.26, ease: [0.65, 0, 0.35, 1] },
                }}
                initial={{ opacity: 0, scale: 0.92, y: 14, rotate: post.rotation }}
                key={post.id}
                lang="ar"
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
                    <span className="community-floating-card__user">{post.username}</span>
                  </span>
                  <span className="community-floating-card__icon" aria-hidden="true">{post.icon}</span>
                </span>
                <span className="community-floating-card__text">{post.text}</span>
                <span className="community-floating-card__footer" aria-hidden="true">
                  <span>{post.likes} إعجاب</span>
                  <span>{post.comments} تعليق</span>
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
