import { useEffect, useRef, useState } from 'react'
import { createBackgroundMusic, type MusicStatus } from '../engine/backgroundMusic'
import Icon from './Icon'

export default function BackgroundMusic() {
  const [status, setStatus] = useState<MusicStatus>('off')
  const player = useRef<ReturnType<typeof createBackgroundMusic> | null>(null)
  const enabled = status === 'on' || status === 'loading'
  const label = enabled ? 'Tắt nhạc nền' : 'Bật nhạc nền'

  useEffect(() => {
    const music = createBackgroundMusic(`${import.meta.env.BASE_URL}audio/theme.mp3`, setStatus)
    player.current = music
    return () => { music.dispose(); player.current = null }
  }, [])

  return <div className="music-control">
    <button className="nav-button music-button" aria-label={label} aria-pressed={enabled} title={label} onClick={() => {
      if (enabled) player.current?.stop()
      else void player.current?.play()
    }}><Icon name={enabled ? 'music' : 'musicOff'}/><span>{label}</span></button>
    {status === 'error' && <p className="music-message" role="status">Chưa phát được nhạc. Bạn có thể bấm bật lại hoặc tiếp tục chơi.</p>}
  </div>
}
