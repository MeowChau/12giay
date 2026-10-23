import type { GameState, Role, StoryCatalog } from '../types/narrative'
import type { Progress } from '../types/progress'
import type { QuizState } from '../types/quiz'
import type { Screen } from '../types/ui'
import { getRoute } from './narrative'
import { canViewEpilogue } from './progress'
import { isEligibleAttempt } from './quiz'

export function resolveScreen(requested: Screen, game: GameState, attempt: QuizState, progress: Progress, epilogueRole: Role | null, stories: StoryCatalog): Screen {
  const route = getRoute(game, stories)
  if (requested === 'story') return route.screen
  if (requested === 'ending') return route.screen === 'ending' ? 'ending' : 'landing'
  if (requested === 'quiz') return isEligibleAttempt(game, attempt, stories) ? 'quiz' : route.screen === 'ending' ? 'ending' : 'landing'
  if (requested === 'epilogue') return canViewEpilogue(progress, epilogueRole) ? 'epilogue' : 'landing'
  return requested
}
