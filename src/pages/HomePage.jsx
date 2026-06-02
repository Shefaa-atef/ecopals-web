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
import earthieAvatarUrl from '../assets/logo@4x.png'
import communityArUrl from '../assets/community_ar.jpg'
import communityEnUrl from '../assets/community_en.jpg'
import EarthieShowcase from '../components/EarthieShowcase'
import HeroParticles from '../components/HeroParticles'
import './HomePage.css'

gsap.registerPlugin(ScrollTrigger)

// ── Community ─────────────────────────────────────────

// 8 slots × 2 posts each
const EN_SLOTS = [
  [{ user: 'Sarah M.', text: '🐱 Found a stray kitten near the park! She needs a loving home. Can anyone help? #AdoptDontShop', likes: 24, comments: 8 }, { user: 'EcoWarrior', text: '🌱 Eco‑hackathon this Friday! Ideas for greener streets welcome. #GreenInnovation', likes: 41, comments: 15 }],
  [{ user: 'Ahmad K.', text: '😡 Spotted illegal waste dumping near the creek. Reported it to the municipality! #EcoAlert', likes: 67, comments: 22 }, { user: 'Lina S.', text: '🌳 Planted 3 trees with my neighbors today. Small action, big change! #PlantMore', likes: 89, comments: 31 }],
  [{ user: 'Omar T.', text: '🚭 Heavy smoking right next to the children\'s playground. Serious air quality issue — let\'s speak up!', likes: 103, comments: 47 }, { user: 'Haya R.', text: '♻️ New recycling bin on Main St! Let\'s actually use it this time. #Recycle', likes: 56, comments: 18 }],
  [{ user: 'Noor A.', text: '💗 Lost cat, pink collar, near Jumeirah. Please share — she deserves a safe home! #CommunityHelp', likes: 38, comments: 12 }, { user: 'Ali H.', text: '🌿 Eco walk this Sunday morning. Families welcome! #GreenCommunity', likes: 72, comments: 29 }],
  [{ user: 'Maya S.', text: '🦎 Found an injured bird in the garden. Local vet is helping 🙏 #WildlifeRescue', likes: 45, comments: 19 }, { user: 'Rayan M.', text: '☀️ Our school installed solar panels today! So proud. #RenewableEnergy', likes: 91, comments: 34 }],
  [{ user: 'Fatima L.', text: '🌊 Beach cleanup last weekend — 40 kg of trash collected! Thank you all 💪', likes: 127, comments: 55 }, { user: 'Khalid B.', text: '🌱 Community garden now open! Free plots for residents. #GrowTogether', likes: 63, comments: 27 }],
  [{ user: 'Dina H.', text: '🐕 Lost dog near the lake, brown collar. Please DM if you see him! 🙏', likes: 52, comments: 23 }, { user: 'Ziad E.', text: '💡 LED streetlights petition hit 500 signatures! Council meeting next week.', likes: 84, comments: 41 }],
  [{ user: 'Sara J.', text: '🌳 20 volunteers, 50 trees planted in one morning. This is community 💚', likes: 156, comments: 68 }, { user: 'Adam C.', text: '♻️ Launched a swap store — bring old stuff, take new stuff. Zero waste! #SwapStore', likes: 99, comments: 44 }],
]

const AR_SLOTS = [
  [{ user: 'سارة م.', text: '🐱 وجدت قطة صغيرة قرب الحديقة! تحتاج منزلاً. #تبني_ولا_تشتري', likes: 24, comments: 8 }, { user: 'محارب البيئة', text: '🌱 هاكاثون بيئي الجمعة! أفكار لشوارع أخضر مرحب بها. #ابتكار_أخضر', likes: 41, comments: 15 }],
  [{ user: 'أحمد ك.', text: '😡 رمي نفايات غير قانوني قرب النهر. أبلغت البلدية! #تنبيه_بيئي', likes: 67, comments: 22 }, { user: 'لينا س.', text: '🌳 زرعت ٣ أشجار مع الجيران اليوم. #ازرع_أكثر', likes: 89, comments: 31 }],
  [{ user: 'عمر ت.', text: '🚭 تدخين شديد قرب ملعب الأطفال. يؤثر على صحتهم — يجب أن نتكلم!', likes: 103, comments: 47 }, { user: 'هيا ر.', text: '♻️ حاوية تدوير جديدة في الحي! فلنستخدمها. #أعد_التدوير', likes: 56, comments: 18 }],
  [{ user: 'نور أ.', text: '💗 قطة ضائعة بطوق وردي. شاركوا! #مجتمع_متعاون', likes: 38, comments: 12 }, { user: 'علي ح.', text: '🌿 مسيرة بيئية الأحد الصباح. #مجتمع_أخضر', likes: 72, comments: 29 }],
  [{ user: 'مايا س.', text: '🦎 طائر مصاب في الحديقة — الطبيب البيطري يساعده 🙏', likes: 45, comments: 19 }, { user: 'ريان م.', text: '☀️ مدرستنا ركّبت ألواح شمسية اليوم! فخورون.', likes: 91, comments: 34 }],
  [{ user: 'فاطمة ل.', text: '🌊 تنظيف شاطئ الأسبوع الماضي — ٤٠ كيلو نفايات! شكراً لكم 💪', likes: 127, comments: 55 }, { user: 'خالد ب.', text: '🌱 حديقة مجتمعية مفتوحة! قطع مجانية للسكان.', likes: 63, comments: 27 }],
  [{ user: 'دينا ح.', text: '🐕 كلب ضائع قرب البحيرة، طوق بني. تواصلوا! 🙏', likes: 52, comments: 23 }, { user: 'زياد ع.', text: '💡 عريضة إضاءة LED وصلت ٥٠٠ توقيع!', likes: 84, comments: 41 }],
  [{ user: 'سارة ج.', text: '🌳 ٢٠ متطوعاً زرعوا ٥٠ شجرة في صباح واحد 💚', likes: 156, comments: 68 }, { user: 'آدم ك.', text: '♻️ متجر مبادلة — أحضر قديماً وخذ جديداً! #صفر_نفايات', likes: 99, comments: 44 }],
]

// Scattered positions across the section (8 slots)
const SCATTER = [
  { style: { top: '3%', left: '0%' }, rotate: '-5deg', z: 7 },
  { style: { top: '5%', left: '28%' }, rotate: '4deg', z: 2 },
  { style: { top: '4%', right: '0%' }, rotate: '6deg', z: 7 },
  { style: { top: '36%', left: '0%' }, rotate: '-4deg', z: 7 },
  { style: { top: '36%', right: '0%' }, rotate: '5deg', z: 7 },
  { style: { bottom: '3%', left: '0%' }, rotate: '3deg', z: 7 },
  { style: { bottom: '5%', left: '28%' }, rotate: '-4deg', z: 2 },
  { style: { bottom: '3%', right: '0%' }, rotate: '-6deg', z: 7 },
]

function CommunityPost({ posts, isAr, rotate, style, z, delay = 0 }) {
  const [index, setIndex] = useState(0)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (posts.length < 2) return
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => setIndex((i) => (i + 1) % posts.length), 4800)
    }, delay)
    return () => { clearTimeout(timeoutRef.current); clearInterval(intervalRef.current) }
  }, [posts.length, delay])

  const post = posts[index]

  function handleHover() {
    setIndex((i) => (i + 1) % posts.length)
  }

  return (
    <div
      className="cpost-float"
      onMouseEnter={handleHover}
      style={{ ...style, zIndex: z, transform: `rotate(${rotate})` }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.22, ease: 'easeIn' } }}
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cpost" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="cpost-header">
              <img alt="" aria-hidden="true" className="cpost-avatar" src={earthieAvatarUrl} />
              <span className="cpost-user">{post.user}</span>
              <span aria-hidden="true" className="cpost-dots">···</span>
            </div>
            <p className="cpost-text">{post.text}</p>
            <div className="cpost-footer">
              <span className="cpost-action">
                <svg aria-hidden="true" fill="none" height="13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="13"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                {post.likes}
              </span>
              <span className="cpost-action">
                <svg aria-hidden="true" fill="none" height="13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="13"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                {post.comments} {isAr ? 'تعليق' : (post.comments === 1 ? 'Comment' : 'Comments')}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
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

      <section className="home-band-community" id="community">
        {/* Scattered floating posts */}
        {SCATTER.map((pos, i) => (
          <CommunityPost
            key={i}
            delay={i * 600}
            isAr={isAr}
            posts={(isAr ? AR_SLOTS : EN_SLOTS)[i]}
            rotate={pos.rotate}
            style={pos.style}
            z={pos.z}
          />
        ))}

        {/* Centered text + phone */}
        <div className="community-center">
          <h2 className="community-heading" dir={isAr ? 'rtl' : 'ltr'}>
            {isAr ? (
              <><span>اكتب</span><br /><span>أبلغ</span><br /><span>ألهم</span></>
            ) : (
              <><span>Post</span><br /><span>Report</span><br /><span>Inspire</span></>
            )}
          </h2>
          {/* Fade out the 3D phone — portrait Euler angles produce edge-on view */}
          <div
            aria-hidden="true"
            className="phone-scene-anchor"
            data-phone-opacity="0"
            data-phone-orientation="landscape"
            style={{ position: 'absolute', width: '1px', height: '1px', pointerEvents: 'none' }}
          />
          {/* CSS phone mockup — screenshot in a real phone frame */}
          <div className="community-phone-mock">
            <img
              alt=""
              aria-hidden="true"
              src={isAr ? communityArUrl : communityEnUrl}
            />
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
