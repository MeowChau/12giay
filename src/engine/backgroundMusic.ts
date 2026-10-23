export type MusicStatus = 'off' | 'loading' | 'on' | 'error'

export function createBackgroundMusic(source: string, onStatus: (status: MusicStatus) => void, createAudio = () => new Audio(source)) {
  const audio = createAudio()
  audio.preload = 'none'
  audio.loop = true
  audio.volume = 0.2
  let desired = false
  let disposed = false
  let attempt = 0

  const onError = () => {
    if (disposed || !desired) return
    desired = false
    attempt++
    audio.pause()
    onStatus('error')
  }
  audio.addEventListener('error', onError)

  return {
    async play() {
      if (disposed || desired) return
      desired = true
      const currentAttempt = ++attempt
      onStatus('loading')
      try {
        await audio.play()
        if (disposed || !desired) audio.pause()
        else if (currentAttempt === attempt) onStatus('on')
      } catch {
        if (disposed || currentAttempt !== attempt) return
        desired = false
        audio.pause()
        onStatus('error')
      }
    },
    stop() {
      if (disposed) return
      desired = false
      attempt++
      audio.pause()
      onStatus('off')
    },
    dispose() {
      disposed = true
      desired = false
      attempt++
      audio.pause()
      audio.removeEventListener('error', onError)
      audio.removeAttribute('src')
      audio.load()
    },
  }
}
