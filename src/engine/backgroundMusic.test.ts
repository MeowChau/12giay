import { describe, expect, it, vi } from 'vitest'
import { createBackgroundMusic, type MusicStatus } from './backgroundMusic'

class FakeAudio extends EventTarget {
  preload = ''
  loop = false
  volume = 1
  play = vi.fn(() => Promise.resolve())
  pause = vi.fn()
  load = vi.fn()
  removeAttribute = vi.fn()
}

function setup() {
  const audio = new FakeAudio()
  const statuses: MusicStatus[] = []
  const music = createBackgroundMusic('audio/theme.mp3', status => statuses.push(status), () => audio as unknown as HTMLAudioElement)
  return { audio, statuses, music }
}

describe('optional background music', () => {
  it('stays silent without fetching or playing until requested, and uses a quiet loop', async () => {
    const { audio, statuses, music } = setup()
    expect(audio.preload).toBe('none')
    expect(audio.play).not.toHaveBeenCalled()
    expect(audio.load).not.toHaveBeenCalled()
    expect(audio.loop).toBe(true)
    expect(audio.volume).toBe(0.2)
    await music.play()
    expect(statuses).toEqual(['loading', 'on'])
    music.stop()
    expect(statuses.at(-1)).toBe('off')
    expect(audio.pause).toHaveBeenCalledOnce()
  })

  it('catches blocked playback and allows an explicit retry', async () => {
    const { audio, statuses, music } = setup()
    audio.play.mockRejectedValueOnce(new Error('NotAllowedError'))
    await expect(music.play()).resolves.toBeUndefined()
    expect(statuses.at(-1)).toBe('error')
    await music.play()
    expect(statuses.at(-1)).toBe('on')
  })

  it('does not queue duplicate starts or restart after a quick toggle off', async () => {
    const { audio, statuses, music } = setup()
    let resolvePlay!: () => void
    audio.play.mockImplementationOnce(() => new Promise(resolve => { resolvePlay = resolve }))
    const pending = music.play()
    await music.play()
    expect(audio.play).toHaveBeenCalledOnce()
    music.stop()
    resolvePlay()
    await pending
    expect(statuses).toEqual(['loading', 'off'])
    expect(audio.pause).toHaveBeenCalledTimes(2)
  })

  it('ignores an old rejected start after off/on starts a newer request', async () => {
    const { audio, statuses, music } = setup()
    let rejectPlay!: (reason: Error) => void
    audio.play.mockImplementationOnce(() => new Promise((_, reject) => { rejectPlay = reject }))
    const oldStart = music.play()
    music.stop()
    await music.play()
    rejectPlay(new Error('Interrupted by pause'))
    await oldStart
    expect(statuses.at(-1)).toBe('on')
  })

  it('reports a decoding/media failure and can be retried', async () => {
    const { audio, statuses, music } = setup()
    await music.play()
    audio.dispatchEvent(new Event('error'))
    expect(statuses.at(-1)).toBe('error')
    await music.play()
    expect(statuses.at(-1)).toBe('on')
  })

  it('releases the element/listener and prevents a pending start after unmount', async () => {
    const { audio, statuses, music } = setup()
    let resolvePlay!: () => void
    audio.play.mockImplementationOnce(() => new Promise(resolve => { resolvePlay = resolve }))
    const pending = music.play()
    music.dispose()
    resolvePlay()
    await pending
    audio.dispatchEvent(new Event('error'))
    await music.play()
    expect(statuses).toEqual(['loading'])
    expect(audio.play).toHaveBeenCalledOnce()
    expect(audio.removeAttribute).toHaveBeenCalledWith('src')
    expect(audio.load).toHaveBeenCalledOnce()
    expect(audio.pause).toHaveBeenCalledTimes(2)
  })
})
