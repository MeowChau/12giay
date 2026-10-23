import Icon from './Icon'
import type { StoryLine } from '../types/narrative'

export default function DialoguePanel({ speaker, line, lineType, canContinue = true, onNext }: { speaker: string; line: string; lineType?: StoryLine['type']; canContinue?: boolean; onNext: () => void }) {
  const label = lineType === 'thought' ? 'Độc thoại' : lineType === 'narration' ? 'Lời dẫn' : lineType === 'dialogue' ? 'Lời thoại' : speaker === 'Cô Hương' ? 'Lời nhắn' : 'Góc nhìn'
  return <div className="dialogue-panel"><div className="speaker-label"><span className="speaker-rule"/>{speaker}<span className="speaker-kind">{label}</span></div><p className="dialogue-line" aria-live="polite">{line}</p><button className="text-button next-button" disabled={!canContinue} onClick={onNext}>Tiếp tục <Icon name="arrow"/></button></div>
}
