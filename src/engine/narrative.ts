import type { GameAction, GameRoute, GameState, EndingType, NarrativeScene, Role, SceneId, StoryCatalog } from '../types/narrative'

export function createInitialState(role: Role): GameState {
  return { role, sceneId: `${role}_intro`, lineIndex: 0, support: 0, safety: 0, accountability: 0, escalation: 0, flags: [], appliedChoiceIds: [] }
}

export function resetGame(state: GameState, role: Role = state.role): GameState {
  return createInitialState(role)
}

export function getCurrentScene(state: GameState, stories: StoryCatalog): NarrativeScene | undefined {
  return stories[state.role].scenes.find(scene => scene.id === state.sceneId && scene.role === state.role)
}

function hasValidLine(state: GameState, scene: NarrativeScene): boolean {
  return Number.isInteger(state.lineIndex) && state.lineIndex >= 0 && state.lineIndex < getSceneLines(state, scene).length
}

export function getSelectedChoice(state: GameState, scene: NarrativeScene) {
  return scene.choices?.find(choice => state.appliedChoiceIds.includes(choice.id))
}

export function getSceneLines(state: GameState, scene: NarrativeScene) {
  const response = getSelectedChoice(state, scene)?.response
  return response?.length ? [...scene.lines, ...response] : scene.lines
}

export function getCurrentLine(state: GameState, stories: StoryCatalog) {
  const scene = getCurrentScene(state, stories)
  return scene && hasValidLine(state, scene) ? getSceneLines(state, scene)[state.lineIndex] : undefined
}

export function applyChoice(state: GameState, sceneId: SceneId, choiceId: string, stories: StoryCatalog): GameState {
  if (state.sceneId !== sceneId) return state
  const scene = getCurrentScene(state, stories)
  if (!scene || scene.kind !== 'decision' || !hasValidLine(state, scene) || state.lineIndex !== scene.lines.length - 1 || getSelectedChoice(state, scene)) return state
  const choice = scene.choices?.find(option => option.id === choiceId)
  if (!choice) return state
  const { effect } = choice
  return {
    ...state,
    lineIndex: choice.response?.length ? scene.lines.length : state.lineIndex,
    support: state.support + (state.role === 'an' ? effect.support ?? 0 : 0),
    safety: state.safety + (state.role === 'an' ? effect.safety ?? 0 : 0),
    accountability: state.accountability + (state.role === 'khai' ? effect.accountability ?? 0 : 0),
    escalation: state.escalation + (state.role === 'khai' ? effect.escalation ?? 0 : 0),
    flags: [...new Set([...state.flags, ...(effect.setFlags ?? [])])],
    appliedChoiceIds: [...state.appliedChoiceIds, choice.id],
  }
}

export function canAdvance(state: GameState, stories: StoryCatalog): boolean {
  const scene = getCurrentScene(state, stories)
  if (!scene || scene.kind === 'ending' || !hasValidLine(state, scene)) return false
  if (state.lineIndex < getSceneLines(state, scene).length - 1) return true
  if (scene.kind === 'decision' && !getSelectedChoice(state, scene)) return false
  return stories[state.role].scenes.some(next => next.id === scene.nextSceneId && next.role === state.role)
}

export function advanceScene(state: GameState, sceneId: SceneId, lineIndex: number, stories: StoryCatalog): GameState {
  if (state.sceneId !== sceneId || state.lineIndex !== lineIndex || !canAdvance(state, stories)) return state
  const scene = getCurrentScene(state, stories)!
  if (state.lineIndex < getSceneLines(state, scene).length - 1) return { ...state, lineIndex: state.lineIndex + 1 }
  return { ...state, sceneId: scene.nextSceneId!, lineIndex: 0 }
}

export function getEnding(state: GameState): EndingType {
  if (state.role === 'an') {
    if (state.support >= 2 && state.safety >= 2 && state.flags.some(flag => flag === 'safetyPlan' || flag === 'writtenStatement' || flag === 'teacherInformed')) return 'positive'
    if (state.support >= 1 || state.safety >= 1) return 'unresolved'
    return 'negative'
  }
  if (state.accountability >= 3 && state.escalation <= 1 && state.flags.includes('repairAction')) return 'positive'
  if (state.accountability >= 1 || state.escalation <= 2) return 'unresolved'
  return 'negative'
}

export function getRoute(state: GameState, stories: StoryCatalog): GameRoute {
  return getCurrentScene(state, stories)?.kind === 'ending'
    ? { screen: 'ending', endingType: getEnding(state) }
    : { screen: 'story' }
}

export function gameReducer(state: GameState, action: GameAction, stories: StoryCatalog): GameState {
  switch (action.type) {
    case 'choose': return applyChoice(state, action.sceneId, action.choiceId, stories)
    case 'advance': return advanceScene(state, action.sceneId, action.lineIndex, stories)
    case 'reset': return resetGame(state, action.role)
    default: return state
  }
}
