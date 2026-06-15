let menuAudioContext
let lastMenuSoundAt = 0
let lastMenuSoundType = null

function getMenuAudioContext() {
  if (typeof window === 'undefined') return null

  const AudioContext = window.AudioContext ?? window.webkitAudioContext
  if (!AudioContext) return null

  menuAudioContext ??= new AudioContext()

  if (menuAudioContext.state === 'suspended') {
    menuAudioContext.resume()
  }

  return menuAudioContext
}

function playMenuTone(audioContext, destination, startTime, frequency, duration, volume, wave = 'sine') {
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = wave
  oscillator.frequency.setValueAtTime(frequency, startTime)
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.018, startTime + duration)

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  oscillator.connect(gain)
  gain.connect(destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + duration + 0.03)
}

function playMenuNoise(audioContext, destination, startTime, duration, volume, filterFrequency = 1400) {
  const sampleRate = audioContext.sampleRate
  const bufferSize = Math.max(1, Math.floor(sampleRate * duration))
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }

  const source = audioContext.createBufferSource()
  const filter = audioContext.createBiquadFilter()
  const gain = audioContext.createGain()

  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(filterFrequency, startTime)
  filter.Q.setValueAtTime(4.8, startTime)

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  source.buffer = buffer
  source.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  source.start(startTime)
  source.stop(startTime + duration + 0.02)
}

export function playMenuSound(type) {
  const currentTime = performance.now()

  if (currentTime - lastMenuSoundAt < (type === lastMenuSoundType ? 110 : 58)) return

  const audioContext = getMenuAudioContext()
  if (!audioContext) return

  lastMenuSoundAt = currentTime
  lastMenuSoundType = type

  const now = audioContext.currentTime
  const masterGain = audioContext.createGain()
  masterGain.gain.setValueAtTime(0.0001, now)
  masterGain.gain.exponentialRampToValueAtTime(0.34, now + 0.018)
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58)
  masterGain.connect(audioContext.destination)

  if (type === 'open') {
    playMenuTone(audioContext, masterGain, now, 523.25, 0.16, 0.034)
    playMenuTone(audioContext, masterGain, now + 0.055, 659.25, 0.16, 0.03)
    playMenuTone(audioContext, masterGain, now + 0.11, 783.99, 0.2, 0.026)
    return
  }

  if (type === 'select') {
    playMenuTone(audioContext, masterGain, now, 659.25, 0.08, 0.028, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.035, 880, 0.11, 0.02, 'sine')
    return
  }

  if (type === 'hover') {
    playMenuTone(audioContext, masterGain, now, 783.99, 0.062, 0.012, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.02, 987.77, 0.07, 0.008, 'sine')
    return
  }

  if (type === 'eco-recycle') {
    playMenuNoise(audioContext, masterGain, now, 0.06, 0.012, 950)
    playMenuTone(audioContext, masterGain, now + 0.025, 493.88, 0.075, 0.02, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.065, 659.25, 0.095, 0.015, 'sine')
    return
  }

  if (type === 'eco-water') {
    playMenuTone(audioContext, masterGain, now, 987.77, 0.075, 0.014, 'sine')
    playMenuTone(audioContext, masterGain, now + 0.038, 739.99, 0.11, 0.014, 'triangle')
    playMenuNoise(audioContext, masterGain, now + 0.018, 0.055, 0.006, 2000)
    return
  }

  if (type === 'eco-plant') {
    playMenuTone(audioContext, masterGain, now, 392, 0.095, 0.02, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.045, 587.33, 0.115, 0.021, 'sine')
    playMenuTone(audioContext, masterGain, now + 0.092, 783.99, 0.125, 0.015, 'sine')
    return
  }

  if (type === 'eco-mood') {
    playMenuTone(audioContext, masterGain, now, 523.25, 0.13, 0.02, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.06, 659.25, 0.15, 0.02, 'sine')
    playMenuTone(audioContext, masterGain, now + 0.125, 880, 0.18, 0.016, 'sine')
    return
  }

  if (type === 'phone-on') {
    playMenuTone(audioContext, masterGain, now, 523.25, 0.07, 0.018, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.035, 783.99, 0.1, 0.016, 'sine')
    return
  }

  if (type === 'phone-off') {
    playMenuTone(audioContext, masterGain, now, 493.88, 0.07, 0.016, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.032, 329.63, 0.11, 0.014, 'sine')
    return
  }

  if (type === 'cta') {
    playMenuTone(audioContext, masterGain, now, 440, 0.075, 0.02, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.042, 659.25, 0.1, 0.02, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.09, 880, 0.15, 0.017, 'sine')
    return
  }

  if (type === 'character') {
    playMenuTone(audioContext, masterGain, now, 659.25, 0.06, 0.014, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.025, 987.77, 0.075, 0.01, 'sine')
    return
  }

  if (type === 'community-card') {
    playMenuNoise(audioContext, masterGain, now, 0.065, 0.011, 1450)
    playMenuTone(audioContext, masterGain, now + 0.03, 587.33, 0.065, 0.009, 'triangle')
    return
  }

  if (type === 'coin') {
    // bright metallic clink — two short high tones with a shimmer
    playMenuTone(audioContext, masterGain, now, 1318.51, 0.055, 0.022, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.028, 1567.98, 0.08, 0.018, 'sine')
    playMenuNoise(audioContext, masterGain, now + 0.01, 0.045, 0.006, 3200)
    return
  }

  if (type === 'score-pop') {
    // punchy upward blip — like a game point counter tick
    playMenuTone(audioContext, masterGain, now, 659.25, 0.038, 0.016, 'square')
    playMenuTone(audioContext, masterGain, now + 0.022, 987.77, 0.055, 0.014, 'triangle')
    return
  }

  if (type === 'progress-tick') {
    // soft ascending tick for gradual bar fill
    playMenuTone(audioContext, masterGain, now, 783.99, 0.042, 0.009, 'sine')
    playMenuTone(audioContext, masterGain, now + 0.018, 880, 0.05, 0.007, 'triangle')
    return
  }

  if (type === 'lang') {
    playMenuTone(audioContext, masterGain, now, 739.99, 0.07, 0.014, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.032, 554.37, 0.075, 0.012, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.064, 830.61, 0.1, 0.012, 'sine')
    return
  }

  if (type === 'rp-throw') {
    // Whoosh as recyclable item launches from the left
    masterGain.gain.setValueAtTime(0.0001, now)
    masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.014)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
    playMenuNoise(audioContext, masterGain, now, 0.16, 0.022, 900)
    playMenuTone(audioContext, masterGain, now, 293.66, 0.1, 0.013, 'sine')
    return
  }

  if (type === 'rp-portal') {
    // Eco chime when item is absorbed into the portal
    masterGain.gain.setValueAtTime(0.0001, now)
    masterGain.gain.exponentialRampToValueAtTime(0.36, now + 0.016)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48)
    playMenuNoise(audioContext, masterGain, now, 0.055, 0.016, 1900)
    playMenuTone(audioContext, masterGain, now + 0.018, 493.88, 0.09, 0.022, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.068, 659.25, 0.14, 0.018, 'sine')
    return
  }

  if (type === 'rp-portal-big') {
    // Reward fanfare — all items recycled!
    masterGain.gain.setValueAtTime(0.0001, now)
    masterGain.gain.exponentialRampToValueAtTime(0.44, now + 0.016)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.78)
    playMenuNoise(audioContext, masterGain, now, 0.05, 0.018, 2600)
    playMenuTone(audioContext, masterGain, now,        523.25, 0.14, 0.026, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.06,  659.25, 0.18, 0.022, 'sine')
    playMenuTone(audioContext, masterGain, now + 0.12,  783.99, 0.22, 0.02,  'sine')
    playMenuTone(audioContext, masterGain, now + 0.20, 1046.5,  0.3,  0.016, 'sine')
    playMenuNoise(audioContext, masterGain, now + 0.16, 0.09, 0.012, 3400)
    return
  }

  if (type === 'rp-reverse') {
    // Descending whoosh as item exits the portal on backward scroll
    masterGain.gain.setValueAtTime(0.0001, now)
    masterGain.gain.exponentialRampToValueAtTime(0.22, now + 0.016)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26)
    playMenuNoise(audioContext, masterGain, now, 0.14, 0.018, 680)
    playMenuTone(audioContext, masterGain, now,        587.33, 0.06, 0.016, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.04,  392,   0.09, 0.014, 'sine')
    return
  }

  playMenuTone(audioContext, masterGain, now, 659.25, 0.12, 0.032)
  playMenuTone(audioContext, masterGain, now + 0.045, 493.88, 0.16, 0.03)
}
