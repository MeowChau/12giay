import type { GameState, Role, StoryCatalog } from '../types/narrative'
import type { Progress, StorageAccess } from '../types/progress'
import type { QuizState } from '../types/quiz'
import { getRoute } from './narrative'
import { gradeQuiz, isEligibleAttempt } from './quiz'

export const PROGRESS_KEY = '12giay:progress:v1'
const browserStorage: StorageAccess = () => globalThis.localStorage

export function emptyProgress(): Progress {
  return { completedRoles: { an: false, khai: false }, quizPassedRoles: { an: false, khai: false } }
}

export function parseProgress(value: unknown): Progress {
  const progress = emptyProgress()
  if (!value || typeof value !== 'object') return progress
  const data = value as Record<string, unknown>
  const completed = data.completedRoles && typeof data.completedRoles === 'object' ? data.completedRoles as Record<string, unknown> : {}
  const passed = data.quizPassedRoles && typeof data.quizPassedRoles === 'object' ? data.quizPassedRoles as Record<string, unknown> : {}
  for (const role of ['an', 'khai'] as const) {
    progress.completedRoles[role] = completed[role] === true
    progress.quizPassedRoles[role] = progress.completedRoles[role] && passed[role] === true
  }
  return progress
}

export function loadProgress(access: StorageAccess = browserStorage): Progress {
  try {
    const raw = access()?.getItem(PROGRESS_KEY)
    return raw ? parseProgress(JSON.parse(raw)) : emptyProgress()
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(progress: Progress, access: StorageAccess = browserStorage): boolean {
  try {
    const storage = access()
    if (!storage) return false
    storage.setItem(PROGRESS_KEY, JSON.stringify(parseProgress(progress)))
    return true
  } catch {
    return false
  }
}

export function recordCompletion(progress: Progress, game: GameState, stories: StoryCatalog): Progress {
  if (getRoute(game, stories).screen !== 'ending' || progress.completedRoles[game.role]) return progress
  return { ...progress, completedRoles: { ...progress.completedRoles, [game.role]: true } }
}

export function recordQuizPass(progress: Progress, game: GameState, attempt: QuizState, stories: StoryCatalog): Progress {
  if (!isEligibleAttempt(game, attempt, stories) || !attempt.result?.passed || !gradeQuiz(attempt.answers)?.passed) return progress
  const completed = recordCompletion(progress, game, stories)
  if (completed.quizPassedRoles[attempt.role]) return completed
  return { ...completed, quizPassedRoles: { ...completed.quizPassedRoles, [attempt.role]: true } }
}

export function canViewEpilogue(progress: Progress, role: Role | null): boolean {
  return role !== null && progress.completedRoles[role] && progress.quizPassedRoles[role]
}
