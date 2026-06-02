let heroVideoRef = null
let heroSoundMuted = true

export function getHeroVideoRef() {
  return heroVideoRef
}

export function setHeroVideoRef(video) {
  heroVideoRef = video
}

export function getHeroSoundMuted() {
  return heroSoundMuted
}

export function setHeroSoundMuted(isMuted) {
  heroSoundMuted = isMuted
}
