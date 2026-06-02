import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../context/LanguageContext'
import { playMenuSound } from '../utils/menuAudio'
import PhoneScrollStage from './PhoneScrollStage'
import raUrl from '../assets/ra.png'
import sh1Url from '../assets/sh1.png'
import sh2Url from '../assets/sh2.png'
import suUrl from '../assets/su.png'
import waUrl from '../assets/wa.png'
import catUrl from '../assets/cat.png'
import duckUrl from '../assets/duck.png'
import googlePlayUrl from '../assets/google-play-svgrepo-com.svg'
import EarthieShowcase from '../components/EarthieShowcase'
import HeroParticles from '../components/HeroParticles'
import './HomePage.css'

gsap.registerPlugin(ScrollTrigger)

// ── Community posts data ──────────────────────────────
const EN_POSTS = [
  [
    { user: 'Sarah M.', color: '#7fb366', text: '🐱 Found a stray kitten near the park! She needs a loving home — can anyone help adopt her? #AdoptDontShop', likes: 24, comments: 8 },
    { user: 'EcoWarrior', color: '#5a913e', text: '🌱 Our neighborhood is hosting an eco‑hackathon this Friday! Ideas for greener streets welcome. #GreenInnovation', likes: 41, comments: 15 },
  ],
  [
    { user: 'Ahmad K.', color: '#f4c542', text: '😡 Spotted illegal waste dumping near the creek again. Reported it to the municipality! Together we keep our city clean. #EcoAlert', likes: 67, comments: 22 },
    { user: 'Lina S.', color: '#5bbbe8', text: '🌳 Planted 3 trees with my neighbors today. Small action, but it feels amazing. #PlantMore', likes: 89, comments: 31 },
  ],
  [
    { user: 'Omar T.', color: '#e29a7b', text: '🚭 Heavy smoking happening right next to the children\'s playground every evening. This is a serious air quality issue — let\'s speak up!', likes: 103, comments: 47 },
    { user: 'Haya R.', color: '#a88fe8', text: '♻️ New recycling station just opened on the main street! Let\'s actually use it this time. #Recycle #CommunityWin', likes: 56, comments: 18 },
  ],
  [
    { user: 'Noor A.', color: '#7fb366', text: '💗 Lost cat wearing a pink collar spotted near Jumeirah. Please share — she deserves a safe home! #CommunityHelp', likes: 38, comments: 12 },
    { user: 'Ali H.', color: '#5a913e', text: '🌿 Eco awareness walk this Sunday morning starting at the park. Join us — families welcome! #GreenCommunity', likes: 72, comments: 29 },
  ],
]

const AR_POSTS = [
  [
    { user: 'سارة م.', color: '#7fb366', text: '🐱 وجدت قطة صغيرة قرب الحديقة! تحتاج منزلاً وعائلة تحبها — هل يمكن لأحد مساعدتها؟ #تبني_ولا_تشتري', likes: 24, comments: 8 },
    { user: 'محارب البيئة', color: '#5a913e', text: '🌱 حينا ينظم هاكاثون بيئي هذا الجمعة! أفكار لشوارع أكثر خضرة مرحب بها. #ابتكار_أخضر', likes: 41, comments: 15 },
  ],
  [
    { user: 'أحمد ك.', color: '#f4c542', text: '😡 رصدت رمي نفايات غير قانوني قرب النهر مرة أخرى. أبلغت البلدية! معاً نحافظ على مدينتنا. #تنبيه_بيئي', likes: 67, comments: 22 },
    { user: 'لينا س.', color: '#5bbbe8', text: '🌳 زرعت ٣ أشجار مع جيراني اليوم. عمل صغير لكن شعوره رائع. #ازرع_أكثر', likes: 89, comments: 31 },
  ],
  [
    { user: 'عمر ت.', color: '#e29a7b', text: '🚭 تدخين شديد قرب ملعب الأطفال كل مساء. هذا يؤثر على صحة أطفالنا — يجب أن نتكلم!', likes: 103, comments: 47 },
    { user: 'هيا ر.', color: '#a88fe8', text: '♻️ حاوية تدوير جديدة افتُتحت في الشارع الرئيسي! فلنستخدمها هذه المرة. #أعد_التدوير', likes: 56, comments: 18 },
  ],
  [
    { user: 'نور أ.', color: '#7fb366', text: '💗 قطة ضائعة تضع طوقاً وردياً قرب المنطقة. شاركوا لو رأيتموها! #مجتمع_متعاون', likes: 38, comments: 12 },
    { user: 'علي ح.', color: '#5a913e', text: '🌿 مسيرة توعية بيئية صباح الأحد من الحديقة. انضموا إلينا — العائلات مرحب بها! #مجتمع_أخضر', likes: 72, comments: 29 },
  ],
]

function PostCard({ user, color, text, likes, comments, isAr }) {
  return (
    <div className="community-post-card" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="community-post-header">
        <div className="community-post-avatar" style={{ background: color }}>
          {user.charAt(0)}
        </div>
        <span className="community-post-username">{user}</span>
        <span className="community-post-menu" aria-hidden="true">···</span>
      </div>
      <p className="community-post-text">{text}</p>
      <div className="community-post-footer">
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          {likes}
        </span>
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          {comments}
        </span>
      </div>
    </div>
  )
}

function RotatingPostSlot({ posts, isAr, delay = 0 }) {
  const [index, setIndex] = useState(0)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (posts.length < 2) return

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % posts.length)
      }, 4600)
    }, delay)

    return () => {
      clearTimeout(timeoutRef.current)
      clearInterval(intervalRef.current)
    }
  }, [posts.length, delay])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.28, ease: 'easeIn' } }}
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      >
        <PostCard {...posts[index]} isAr={isAr} />
      </motion.div>
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────
const heroCharacters = [
  { key: 'sh2', src: sh2Url, alt: 'EcoPals character holding a plant', className: 'hero-character-sh2' },
  { key: 'ra', src: raUrl, alt: 'EcoPals character in a beige dress', className: 'hero-character-ra' },
  { key: 'sh1', src: sh1Url, alt: 'EcoPals character in a lavender outfit', className: 'hero-character-sh1' },
  { key: 'su', src: suUrl, alt: 'EcoPals character holding flowers', className: 'hero-character-su' },
  { key: 'wa', src: waUrl, alt: 'EcoPals character making a heart gesture', className: 'hero-character-wa' },
  { key: 'cat', src: catUrl, alt: 'Cat companion', className: 'hero-character-cat' },
  { key: 'duck', src: duckUrl, alt: 'Duck companion', className: 'hero-character-duck' },
]

export default function HomePage() {
  const { lang, isAr } = useLang()
  const heroTitle = isAr ? 'إيكوبالز' : 'EcoPals'
  const aboutStickyRef = useRef(null)
  const [earthieEnergy, setEarthieEnergy] = useState(0)

  useGSAP(() => {
    const sticky = aboutStickyRef.current
    if (!sticky) return

    ScrollTrigger.create({
      trigger: sticky,
      start: 'top top',
      end: '+=260%',
      pin: true,
      pinSpacing: true,
      onUpdate: ({ progress }) => {
        setEarthieEnergy(Math.min(progress * 100, 100))
      },
    })
  }, [])

  return (
    <>
      <PhoneScrollStage />

      <section className="home-stage ecopals-hero" id="home" aria-label="EcoPals game hero">
        <HeroParticles />

        <motion.div
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          aria-hidden="true"
          className="ecopals-hero-word"
          initial={{ opacity: 0, scale: 1.22, filter: 'blur(18px)' }}
          transformTemplate={() => 'translateX(-50%)'}
          transition={{ delay: 0, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={lang}
              className={isAr ? 'hero-word--ar' : undefined}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: isAr ? -22 : 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              style={{ display: 'block' }}
            >
              {heroTitle}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <div className="hero-poster">
          <div
            aria-hidden="true"
            className="hero-phone-slot phone-scene-anchor"
            data-phone-content="earthie-video"
            data-phone-orientation="landscape"
          />

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            className="hero-google-play-wrap"
            initial={{ opacity: 0, scale: 0.5, y: 24, rotate: -4 }}
            transformTemplate={({ y }) => `translateX(-50%) translateY(${y ?? '0px'})`}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 2.4 }}
          >
            <motion.a
              aria-label={isAr ? 'افتح إيكوبالز على جوجل بلاي' : 'Open EcoPals on Google Play'}
              className={`hero-google-play ${isAr ? 'hero-google-play--ar' : ''}`}
              href="https://play.google.com/store/apps/details?id=com.ecopals"
              rel="noopener noreferrer"
              target="_blank"
              onMouseEnter={() => playMenuSound('hover')}
              onFocus={() => playMenuSound('hover')}
              whileHover={{
                y: -4,
                scale: 1.04,
                rotate: -0.8,
                transition: { type: 'spring', stiffness: 420, damping: 18 },
              }}
              whileTap={{ scale: 0.95, y: 1 }}
            >
              <img className="hero-google-play-icon" src={googlePlayUrl} alt={isAr ? 'جوجل بلاي' : 'Google Play'} />
              <span className={`hero-google-play-text ${isAr ? 'hero-google-play-text--ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
                <small>{isAr ? 'متوفر على' : 'GET IT ON'}</small>
                <strong>{isAr ? 'جوجل بلاي' : 'Google Play'}</strong>
              </span>
            </motion.a>
          </motion.div>

          {heroCharacters.map((character, i) => (
            <motion.img
              alt={character.alt}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              className={`hero-character ${character.className}`}
              draggable="false"
              initial={{ opacity: 0, y: 90, scale: 0.6, rotate: i % 2 === 0 ? -14 : 14 }}
              key={character.key}
              src={character.src}
              style={{ originX: 0.5, originY: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 18,
                mass: 0.7,
                delay: 1.1 + Math.floor(i / 2) * 0.38,
              }}
              whileHover={{
                y: -14,
                scale: 1.07,
                rotate: i % 2 === 0 ? -2.5 : 2.5,
                transition: { type: 'spring', stiffness: 380, damping: 16 },
              }}
              whileTap={{ scale: 0.95, y: -4 }}
            />
          ))}
        </div>
      </section>

      <section className="home-band home-band-about" id="game" aria-label="EcoPals app description">
        <div className="about-sticky" ref={aboutStickyRef}>
          <div className="about-background-word" aria-hidden="true">EcoPals</div>
          <div className="about-deco-ring" aria-hidden="true" />
          <div className="about-stage">
            <div
              aria-hidden="true"
              className="about-phone-anchor phone-scene-anchor"
              data-phone-content="app-description"
              data-phone-float-amount="0"
              data-phone-orientation="landscape"
              data-phone-scale="2.12"
            />
            <EarthieShowcase isAr={isAr} energy={earthieEnergy} />
          </div>
        </div>
      </section>

      <section className="home-band home-band-community" id="community">
        <div className="community-header">
          <p className="eyebrow">{isAr ? 'المجتمع' : 'Community'}</p>
          <h2 dir={isAr ? 'rtl' : 'ltr'}>
            {isAr ? 'صوتك يغيّر الكوكب' : 'Your voice can change the planet.'}
          </h2>
          <p className="community-desc" dir={isAr ? 'rtl' : 'ltr'}>
            {isAr
              ? 'رأيت قطة ضائعة؟ أبلغت عن تلوث في حيّك؟ ابدأ هاكاثوناً بيئياً. مجتمع إيكوبالز يحوّل اللحظات اليومية إلى عمل بيئي حقيقي.'
              : 'Spotted a stray animal? Reported pollution in your street? Starting an eco‑hackathon? EcoPals turns everyday moments into real eco‑action — together.'}
          </p>
        </div>

        <div className="community-stage">
          <div className="community-posts-col">
            <RotatingPostSlot isAr={isAr} posts={isAr ? AR_POSTS[0] : EN_POSTS[0]} delay={0} />
            <RotatingPostSlot isAr={isAr} posts={isAr ? AR_POSTS[1] : EN_POSTS[1]} delay={2200} />
          </div>

          <div
            aria-hidden="true"
            className="community-phone-anchor phone-scene-anchor"
            data-phone-content="community"
            data-phone-float-amount="0.6"
            data-phone-orientation="portrait"
            data-phone-scale="1.72"
          />

          <div className="community-posts-col">
            <RotatingPostSlot isAr={isAr} posts={isAr ? AR_POSTS[2] : EN_POSTS[2]} delay={1100} />
            <RotatingPostSlot isAr={isAr} posts={isAr ? AR_POSTS[3] : EN_POSTS[3]} delay={3300} />
          </div>
        </div>
      </section>

      <section className="home-band home-band-earthie" id="earthie">
        <p className="eyebrow">Earthie</p>
        <h2>Your cheerful eco companion.</h2>
      </section>
    </>
  )
}
