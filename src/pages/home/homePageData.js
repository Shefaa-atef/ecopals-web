import catUrl from '../../assets/cat.png'
import ch1Url from '../../assets/ch1.png'
import ch2Url from '../../assets/ch2.png'
import ch3Url from '../../assets/ch3.png'
import ch4Url from '../../assets/ch4.png'
import ch5Url from '../../assets/ch5.png'
import ch6Url from '../../assets/ch6.png'
import ch7Url from '../../assets/ch7.png'
import ch9Url from '../../assets/ch9.png'
import coinUrl from '../../assets/coin.png'
import duckUrl from '../../assets/duck.png'
import googlePlayUrl from '../../assets/google-play-svgrepo-com.svg'
import raUrl from '../../assets/ra.png'
import sh1Url from '../../assets/sh1.png'
import sh2Url from '../../assets/sh2.png'
import suUrl from '../../assets/su.png'
import waUrl from '../../assets/wa.png'

export { coinUrl, googlePlayUrl }

export const heroCharacters = [
  { key: 'sh2', src: sh2Url, alt: 'EcoPals character holding a plant', className: 'hero-character-sh2' },
  { key: 'ra', src: raUrl, alt: 'EcoPals character in a beige dress', className: 'hero-character-ra' },
  { key: 'sh1', src: sh1Url, alt: 'EcoPals character in a lavender outfit', className: 'hero-character-sh1' },
  { key: 'su', src: suUrl, alt: 'EcoPals character holding flowers', className: 'hero-character-su' },
  { key: 'wa', src: waUrl, alt: 'EcoPals character making a heart gesture', className: 'hero-character-wa' },
  { key: 'cat', src: catUrl, alt: 'Cat companion', className: 'hero-character-cat' },
  { key: 'duck', src: duckUrl, alt: 'Duck companion', className: 'hero-character-duck' },
]

export const challengePlanes = [
  [
    { key: 'plant-care', src: ch1Url, className: 'challenge-photo--one', alt: 'EcoPals plant care challenge artwork' },
    { key: 'watering', src: ch2Url, className: 'challenge-photo--two', alt: 'EcoPals watering challenge artwork' },
    { key: 'recycling', src: ch9Url, className: 'challenge-photo--three', alt: 'EcoPals recycling challenge artwork' },
  ],
  [
    { key: 'cleanup', src: ch3Url, className: 'challenge-photo--four', alt: 'EcoPals clean up challenge artwork' },
    { key: 'energy', src: ch4Url, className: 'challenge-photo--five', alt: 'EcoPals eco action challenge artwork' },
    { key: 'garden', src: ch5Url, className: 'challenge-photo--six', alt: 'EcoPals garden challenge artwork' },
  ],
  [
    { key: 'water-save', src: ch6Url, className: 'challenge-photo--seven', alt: 'EcoPals water saving challenge artwork' },
    { key: 'daily-streak', src: ch7Url, className: 'challenge-photo--eight', alt: 'EcoPals daily challenge artwork' },
  ],
]

export const challengeCopy = {
  en: {
    kicker: 'Eco challenges',
    title: 'Complete challenges. Earn coins.',
    body: 'Pick simple eco missions inside the app, finish real actions, and earn coins and points as your progress grows.',
  },
  ar: {
    kicker: 'التحديات البيئية',
    title: 'أنجز التحديات واجمع العملات',
    body: 'اختر تحديات بيئية بسيطة داخل التطبيق، أنجز أفعالاً حقيقية، واجمع العملات والنقاط مع تقدمك.',
  },
}

export const preparedSections = [
  {
    key: 'recycle-challenges',
    label: '01',
    kicker: { en: 'Game section', ar: 'قسم اللعبة' },
    title: { en: 'Recycle Challenges', ar: 'تحديات إعادة التدوير' },
  },
  {
    key: 'clothing-game',
    label: '02',
    kicker: { en: 'Game section', ar: 'قسم اللعبة' },
    title: { en: 'Clothing Game', ar: 'لعبة الملابس' },
  },
  {
    key: 'match-3-game',
    label: '03',
    kicker: { en: 'Game section', ar: 'قسم اللعبة' },
    title: { en: 'Match 3 Game', ar: 'لعبة ماتش 3' },
  },
]
