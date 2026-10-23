export type Role = 'an' | 'khai'
export type EndingType = 'positive' | 'unresolved' | 'negative'
export type BackgroundId = 'hallway' | 'classroom' | 'chatroom' | 'teacherroom'
export type PortraitId = Role | 'mai'
export type SceneId = `${Role}_${'intro' | '1' | '2' | '3' | '4' | 'reveal' | 'ending'}`
export type OptionKey = 'A' | 'B' | 'C'
export type ChoiceId = `${Role}_${'1' | '2' | '3' | '4'}_${OptionKey}`
export type Flag =
  | 'evidenceSaved' | 'boundarySet' | 'steppedAway' | 'adultNotified'
  | 'confidedMai' | 'needsTime' | 'containClip' | 'teacherInformed' | 'distance'
  | 'safetyPlan' | 'writtenStatement' | 'needMoreTime' | 'joinMockery' | 'ignoredClip'
  | 'stopForwarding' | 'blameShift' | 'heardMai' | 'askedContext' | 'denied'
  | 'admitted' | 'acceptedRecord' | 'repairAction' | 'apologyOffered' | 'deflected'

export type ChoiceEffect = {
  support?: number
  safety?: number
  accountability?: number
  escalation?: number
  setFlags?: readonly Flag[]
}

export type NarrativeChoice = {
  id: ChoiceId
  text: string
  effect: ChoiceEffect
  response?: readonly StoryLine[]
}

export type StoryEvidence = { title: string; detail: string; progress?: number }

export type StoryLine = {
  id: string
  speaker: string
  text: string
  type: 'narration' | 'dialogue' | 'thought'
  background?: BackgroundId
  portrait?: PortraitId
  evidence?: StoryEvidence
}

export type NarrativeScene = {
  id: SceneId
  role: Role
  kind: 'intro' | 'decision' | 'reveal' | 'ending'
  title: string
  location: string
  background: BackgroundId
  portrait?: PortraitId
  lines: readonly StoryLine[]
  choices?: readonly NarrativeChoice[]
  nextSceneId?: SceneId
}

export type NarrativeStory = { role: Role; scenes: readonly NarrativeScene[] }
export type StoryCatalog = Record<Role, NarrativeStory>

export type GameState = {
  role: Role
  sceneId: SceneId
  lineIndex: number
  support: number
  safety: number
  accountability: number
  escalation: number
  flags: Flag[]
  appliedChoiceIds: ChoiceId[]
}

export type GameAction =
  | { type: 'choose'; sceneId: SceneId; choiceId: string }
  | { type: 'advance'; sceneId: SceneId; lineIndex: number }
  | { type: 'reset'; role?: Role }

export type GameRoute = { screen: 'story' } | { screen: 'ending'; endingType: EndingType }
