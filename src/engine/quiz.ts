import { quizQuestions } from '../data/quiz'
import type { GameState, Role, StoryCatalog } from '../types/narrative'
import type { AnswerId, QuizAction, QuizAnswers, QuizResult, QuizState } from '../types/quiz'
import { getRoute } from './narrative'

export function createQuizState(role: Role): QuizState {
  return { role, questionIndex: 0, answers: {}, result: null }
}

export function hasAllAnswers(answers: QuizAnswers): boolean {
  return quizQuestions.every(question => question.options.some(option => option.id === answers[question.id]))
}

export function gradeQuiz(answers: QuizAnswers): QuizResult | null {
  if (!hasAllAnswers(answers)) return null
  const feedback = quizQuestions.map(question => ({
    questionId: question.id,
    selected: answers[question.id]!,
    correctAnswer: question.correctAnswer,
    correct: answers[question.id] === question.correctAnswer,
    explanation: question.explanation,
  }))
  const correctCount = feedback.filter(item => item.correct).length
  return { correctCount, passed: correctCount >= 9, feedback }
}

export function canStartQuiz(game: GameState, stories: StoryCatalog): boolean {
  const route = getRoute(game, stories)
  return route.screen === 'ending' && route.endingType === 'positive'
}

export function isEligibleAttempt(game: GameState, attempt: QuizState, stories: StoryCatalog): boolean {
  return game.role === attempt.role && canStartQuiz(game, stories)
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  if (action.type === 'reset') return createQuizState(action.role)
  if (action.role !== state.role) return state
  switch (action.type) {
    case 'retry': return createQuizState(state.role)
    case 'answer': {
      if (state.result) return state
      const question = quizQuestions.find(item => item.id === action.questionId)
      if (!question || !question.options.some(option => option.id === action.answerId) || state.answers[question.id] === action.answerId) return state
      return { ...state, answers: { ...state.answers, [question.id]: action.answerId as AnswerId } }
    }
    case 'navigate':
      if (state.result || !Number.isInteger(action.index) || action.index < 0 || action.index >= quizQuestions.length || action.index === state.questionIndex) return state
      return { ...state, questionIndex: action.index }
    case 'submit': {
      if (state.result) return state
      const result = gradeQuiz(state.answers)
      return result ? { ...state, result } : state
    }
    default: return state
  }
}
