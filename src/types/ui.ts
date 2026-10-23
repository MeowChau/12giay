import type { BackgroundId, EndingType, PortraitId, Role, StoryEvidence, StoryLine } from './narrative'
export type { Role, PortraitId } from './narrative'
export type Screen = 'warning' | 'landing' | 'roles' | 'story' | 'ending' | 'quiz' | 'epilogue' | 'support'
export type Backdrop = BackgroundId
export type EndingPreview = EndingType

export type CharacterPreview = {
  id: Role
  name: string
  subtitle: string
  description: string
  number: string
}

export type ScenePreview = {
  id: Backdrop
  title: string
  location: string
  speaker: string
  portrait?: PortraitId
  line: string
  lineType?: StoryLine['type']
  evidence?: StoryEvidence
}

export type OptionPreview = { id: string; text: string }
export type DecisionProgress = { id: string; label: string; completed: boolean; current: boolean }
