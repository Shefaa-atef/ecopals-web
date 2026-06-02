let menuAudioContext
let lastMenuSoundAt = 0

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

export function playMenuSound(type) {
  const currentTime = performance.now()

  if (currentTime - lastMenuSoundAt < 70) return

  const audioContext = getMenuAudioContext()
  if (!audioContext) return

  lastMenuSoundAt = currentTime

  const now = audioContext.currentTime
  const masterGain = audioContext.createGain()
  masterGain.gain.setValueAtTime(0.0001, now)
  masterGain.gain.exponentialRampToValueAtTime(0.52, now + 0.018)
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72)
  masterGain.connect(audioContext.destination)

  if (type === 'open') {
    playMenuTone(audioContext, masterGain, now, 523.25, 0.18, 0.04)
    playMenuTone(audioContext, masterGain, now + 0.055, 659.25, 0.18, 0.035)
    playMenuTone(audioContext, masterGain, now + 0.11, 880, 0.22, 0.032)
    return
  }

  if (type === 'select') {
    playMenuTone(audioContext, masterGain, now, 783.99, 0.09, 0.035, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.035, 1046.5, 0.12, 0.026, 'sine')
    return
  }

  if (type === 'hover') {
    playMenuTone(audioContext, masterGain, now, 932.33, 0.075, 0.018, 'triangle')
    playMenuTone(audioContext, masterGain, now + 0.024, 1174.66, 0.08, 0.012, 'sine')
    return
  }

  playMenuTone(audioContext, masterGain, now, 659.25, 0.12, 0.032)
  playMenuTone(audioContext, masterGain, now + 0.045, 493.88, 0.16, 0.03)
}
