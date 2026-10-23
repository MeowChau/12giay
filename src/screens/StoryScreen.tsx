import { useEffect, useRef } from 'react'
import { Portrait, SceneArtwork } from '../components/Artwork'
import ChoiceList from '../components/ChoiceList'
import DialoguePanel from '../components/DialoguePanel'
import Icon from '../components/Icon'
import type { DecisionProgress, OptionPreview, Role, ScenePreview } from '../types/ui'

type Props = {
  steps: DecisionProgress[]
  sceneIndex: number
  sceneCount: number
  role: Role
  scene: ScenePreview
  choices: readonly OptionPreview[]
  selectedChoice: string | null
  canContinue: boolean
  onChoice: (id: string) => void
  onNext: () => void
}

export default function StoryScreen({ steps, sceneIndex, sceneCount, role, scene, choices, selectedChoice, canContinue, onChoice, onNext }: Props) {
  const dialogueRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!selectedChoice) return
    dialogueRef.current?.querySelector<HTMLButtonElement>('.next-button')?.focus({ preventScroll: true })
    dialogueRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }, [selectedChoice])
  return <section className="story-screen">
    <div className="story-location"><div><p className="eyebrow">Góc nhìn {role === 'an' ? 'An' : 'Khải'}</p><h1>{scene.title}</h1></div><span className="location-label">{scene.location}</span></div>
    <div className="story-stage"><SceneArtwork scene={scene.id}/><div className="stage-vignette"/><span className="stage-scene-label">{String(sceneIndex + 1).padStart(2, '0')} / {String(sceneCount).padStart(2, '0')} <span>CẢNH DEMO</span></span>{scene.portrait && <Portrait character={scene.portrait} className="story-portrait"/>}<div className="stage-bottom-shade"/>
      {scene.evidence && <aside className="story-evidence" aria-hidden="true"><p>{scene.evidence.title}</p><strong>{scene.evidence.detail}</strong>{scene.evidence.progress !== undefined && <div className="evidence-timeline"><span style={{ width: `${scene.evidence.progress * 100}%` }}/></div>}</aside>}
      <div className="story-dialogue" ref={dialogueRef}><DialoguePanel speaker={scene.speaker} line={scene.line} lineType={scene.lineType} canContinue={canContinue} onNext={onNext}/></div>
    </div>
    <div className="story-below"><div className="scene-navigation"><p className="eyebrow">Bốn quyết định</p><ol className="scene-tabs decision-progress" aria-label="Tiến trình quyết định">{steps.map((step, index) => <li className={step.current ? 'is-active' : ''} key={step.id} aria-current={step.current ? 'step' : undefined}><span>0{index + 1}</span>{step.label}{step.completed && <Icon name="check"/>}</li>)}</ol></div><div className="story-choices"><p className="eyebrow">{choices.length ? 'Bạn sẽ làm gì?' : 'Câu chuyện'}</p>{choices.length ? <ChoiceList options={choices} selected={selectedChoice} locked={!!selectedChoice} onSelect={onChoice}/> : <p className="story-hint">Bấm Tiếp tục để đọc tiếp.</p>}{selectedChoice && <p className="story-hint" role="status">Đã ghi nhận lựa chọn. Bấm Tiếp tục.</p>}</div></div>
  </section>
}
