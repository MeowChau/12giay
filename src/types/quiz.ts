import type { Role } from './narrative'

export type QuestionId = `Q${'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'}`
export type AnswerId = 'A' | 'B' | 'C' | 'D'
export type QuizQuestion = {
  id: QuestionId
  title: string
  question: string
  options: readonly { id: AnswerId; text: string }[]
  correctAnswer: AnswerId
  explanation: string
}
export type QuizAnswers = Partial<Record<QuestionId, AnswerId>>
export type QuizResult = {
  correctCount: number
  passed: boolean
  feedback: readonly { questionId: QuestionId; selected: AnswerId; correctAnswer: AnswerId; correct: boolean; explanation: string }[]
}
export type QuizState = { role: Role; questionIndex: number; answers: QuizAnswers; result: QuizResult | null }
export type QuizAction =
  | { type: 'answer'; role: Role; questionId: string; answerId: string }
  | { type: 'navigate'; role: Role; index: number }
  | { type: 'submit'; role: Role }
  | { type: 'retry'; role: Role }
  | { type: 'reset'; role: Role }
