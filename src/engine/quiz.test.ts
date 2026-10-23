/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { epilogueClosing, epilogues } from '../data/epilogues'
import { quizQuestions } from '../data/quiz'
import { stories } from '../data/stories'
import type { GameState, Role } from '../types/narrative'
import type { ProgressStorage } from '../types/progress'
import type { QuizAnswers } from '../types/quiz'
import { resolveScreen } from './access'
import { createInitialState, gameReducer, getCurrentScene, getRoute, getSelectedChoice } from './narrative'
import { canViewEpilogue, emptyProgress, loadProgress, parseProgress, PROGRESS_KEY, recordCompletion, recordQuizPass, saveProgress } from './progress'
import { canStartQuiz, createQuizState, gradeQuiz, hasAllAnswers, isEligibleAttempt, quizReducer } from './quiz'

function answersFor(correctCount: number): QuizAnswers {
  return Object.fromEntries(quizQuestions.map((question, index) => [question.id, index < correctCount ? question.correctAnswer : question.options.find(option => option.id !== question.correctAnswer)!.id]))
}

function submitted(role: Role, correctCount: number) {
  return quizReducer({ ...createQuizState(role), answers: answersFor(correctCount) }, { type: 'submit', role })
}

function finish(role: Role, answers: string): GameState {
  let game = createInitialState(role)
  let index = 0
  for (let step = 0; step < 250; step++) {
    if (getRoute(game, stories).screen === 'ending') return game
    const scene = getCurrentScene(game, stories)!
    const action = scene.kind === 'decision' && !getSelectedChoice(game, scene) && game.lineIndex === scene.lines.length - 1
      ? { type: 'choose' as const, sceneId: scene.id, choiceId: `${scene.id}_${answers[index++]}` }
      : { type: 'advance' as const, sceneId: game.sceneId, lineIndex: game.lineIndex }
    game = gameReducer(game, action, stories)
  }
  throw new Error('Narrative did not finish')
}

describe('canonical quiz and epilogues', () => {
  it('copies all ten questions, four options, keys and explanations verbatim from the document', () => {
    const doc = readFileSync(new URL('../../../docs/QUIZ.md', import.meta.url), 'utf8')
    expect(quizQuestions).toHaveLength(10)
    expect(new Set(quizQuestions.map(question => question.id)).size).toBe(10)
    quizQuestions.forEach((question, index) => {
      const block = doc.slice(doc.indexOf(`## ${question.id} — `)).split('\n## ')[0]
      expect(question.id).toBe(`Q${String(index + 1).padStart(2, '0')}`)
      expect(question.title).toBe(block.split('\n')[0].split(' — ')[1].trim())
      expect(question.question).toBe(/^\*\*Câu:\*\* (.+)$/m.exec(block)![1].trim())
      const options = block.split('\n').filter(line => /^- [ABCD]\. /.test(line)).map(line => ({ id: line[2], text: line.slice(5).trimEnd() }))
      expect(question.options).toEqual(options)
      expect(question.options).toHaveLength(4)
      const key = /^\*\*Đúng: ([ABCD])\.\*\* Giải thích: (.+)$/m.exec(block)!
      expect(question.correctAnswer).toBe(key[1])
      expect(question.explanation).toBe(key[2].trimEnd())
    })
    expect(quizQuestions.map(question => question.correctAnswer).join('')).toBe('BACDBCADBC')
  })

  it('uses the exact role epilogues and shared closing', () => {
    const script = readFileSync(new URL('../../../docs/STORY_SCRIPT.md', import.meta.url), 'utf8')
    const block = script.slice(script.indexOf('## `true_epilogue`'), script.indexOf('## Hỗ trợ'))
    expect(epilogues.an).toBe(/\*\*An:\*\* “([^”]+)”/.exec(block)![1])
    expect(epilogues.khai).toBe(/\*\*Khải:\*\* “([^”]+)”/.exec(block)![1])
    expect(epilogueClosing).toBe(/\*\*Closing shared:\*\* “([^”]+)”/.exec(block)![1])
  })
})

describe('pure quiz scoring', () => {
  it.each([[0, false], [8, false], [9, true], [10, true]])('%i/10 passes=%s', (score, passed) => {
    const answers = answersFor(score as number)
    const snapshot = structuredClone(answers)
    const result = gradeQuiz(answers)!
    expect(result.correctCount).toBe(score)
    expect(result.passed).toBe(passed)
    expect(result.feedback).toHaveLength(10)
    expect(result.feedback.filter(item => item.correct)).toHaveLength(score as number)
    expect(result.feedback.every(item => item.explanation)).toBe(true)
    expect(answers).toEqual(snapshot)
  })

  it('rejects empty, incomplete and invalid answers even when nine answers are correct', () => {
    const answers = answersFor(10)
    delete answers.Q10
    expect(gradeQuiz({})).toBeNull()
    expect(hasAllAnswers(answers)).toBe(false)
    expect(gradeQuiz(answers)).toBeNull()
    expect(gradeQuiz({ ...answers, Q10: 'X' } as unknown as QuizAnswers)).toBeNull()
    const state = { ...createQuizState('an'), answers }
    expect(quizReducer(state, { type: 'submit', role: 'an' })).toBe(state)
  })

  it('scores final edited answers and freezes the accepted submission', () => {
    let state = { ...createQuizState('an'), answers: answersFor(8) }
    state = quizReducer(state, { type: 'answer', role: 'an', questionId: 'Q09', answerId: 'B' })
    expect(state.result).toBeNull()
    const result = quizReducer(state, { type: 'submit', role: 'an' })
    expect(result.result?.correctCount).toBe(9)
    expect(quizReducer(result, { type: 'submit', role: 'an' })).toBe(result)
    expect(quizReducer(result, { type: 'answer', role: 'an', questionId: 'Q09', answerId: 'A' })).toBe(result)
  })

  it('supports review/navigation without losing answers and rejects invalid indices/options', () => {
    const initial = createQuizState('an')
    let state = quizReducer(initial, { type: 'answer', role: 'an', questionId: 'Q01', answerId: 'B' })
    state = quizReducer(state, { type: 'navigate', role: 'an', index: 9 })
    expect(state.questionIndex).toBe(9)
    state = quizReducer(state, { type: 'navigate', role: 'an', index: 0 })
    expect(state.answers.Q01).toBe('B')
    for (const index of [-1, 10, 1.5]) expect(quizReducer(state, { type: 'navigate', role: 'an', index })).toBe(state)
    expect(quizReducer(state, { type: 'answer', role: 'an', questionId: 'Q11', answerId: 'B' })).toBe(state)
    expect(quizReducer(state, { type: 'answer', role: 'an', questionId: 'Q01', answerId: 'X' })).toBe(state)
    expect(initial.answers).toEqual({})
  })

  it('allows repeated retry, clearing every answer, result and question index', () => {
    let state = submitted('an', 8)
    for (let attempt = 0; attempt < 12; attempt++) {
      const retry = quizReducer(state, { type: 'retry', role: 'an' })
      expect(retry).toEqual(createQuizState('an'))
      expect(retry.answers).not.toBe(state.answers)
      state = quizReducer({ ...retry, answers: answersFor(9) }, { type: 'submit', role: 'an' })
      expect(state.result?.passed).toBe(true)
    }
  })

  it('resets across roles and ignores stale actions from the previous role', () => {
    const an = submitted('an', 10)
    const khai = quizReducer(an, { type: 'reset', role: 'khai' })
    expect(khai).toEqual(createQuizState('khai'))
    expect(quizReducer(khai, { type: 'answer', role: 'an', questionId: 'Q01', answerId: 'B' })).toBe(khai)
    expect(quizReducer(khai, { type: 'submit', role: 'an' })).toBe(khai)
    expect(quizReducer(khai, { type: 'retry', role: 'an' })).toBe(khai)
    expect(an.result?.correctCount).toBe(10)
  })
})

describe('eligibility and role progress', () => {
  const vectors = [['an', 'AAAA', true], ['an', 'CBCC', false], ['an', 'CCCC', false], ['khai', 'CBBA', true], ['khai', 'BBAB', false], ['khai', 'AAAC', false]] as const
  it.each(vectors)('%s %s quiz access=%s', (role, answers, eligible) => {
    const game = finish(role, answers)
    expect(canStartQuiz(game, stories)).toBe(eligible)
    const progress = recordQuizPass(emptyProgress(), game, submitted(role, 9), stories)
    expect(canViewEpilogue(progress, role)).toBe(eligible)
  })

  it('does not mark completion or unlock a quiz before the actual ending', () => {
    const progress = emptyProgress()
    const initial = { ...createInitialState('an'), support: 10, safety: 10, flags: ['safetyPlan'] as GameState['flags'] }
    expect(canStartQuiz(initial, stories)).toBe(false)
    expect(recordCompletion(progress, initial, stories)).toBe(progress)
    expect(recordQuizPass(progress, initial, submitted('an', 10), stories)).toBe(progress)
  })

  it('records all completed endings but never grants a pass for 8/10, missing submission, or another role', () => {
    const game = finish('an', 'AAAA')
    const progress = recordCompletion(emptyProgress(), game, stories)
    expect(progress.completedRoles).toEqual({ an: true, khai: false })
    expect(recordQuizPass(progress, game, submitted('an', 8), stories)).toBe(progress)
    expect(recordQuizPass(progress, game, { ...createQuizState('an'), answers: answersFor(10) }, stories)).toBe(progress)
    expect(recordQuizPass(progress, game, submitted('khai', 10), stories)).toBe(progress)
    const forged = submitted('an', 8)
    expect(recordQuizPass(progress, game, { ...forged, result: { ...forged.result!, passed: true } }, stories)).toBe(progress)
    const negative = recordCompletion(progress, finish('khai', 'AAAC'), stories)
    expect(negative.completedRoles).toEqual({ an: true, khai: true })
    expect(negative.quizPassedRoles).toEqual({ an: false, khai: false })
  })

  it('keeps passes independent and preserves a historic achievement after a later failed attempt', () => {
    const anGame = finish('an', 'AAAA')
    const initial = emptyProgress()
    const an = recordQuizPass(initial, anGame, submitted('an', 9), stories)
    expect(an.quizPassedRoles).toEqual({ an: true, khai: false })
    expect(initial).toEqual(emptyProgress())
    expect(recordQuizPass(an, anGame, submitted('an', 8), stories)).toBe(an)
    const both = recordQuizPass(an, finish('khai', 'CBBA'), submitted('khai', 10), stories)
    expect(both.quizPassedRoles).toEqual({ an: true, khai: true })
    expect(an.quizPassedRoles.khai).toBe(false)
  })
})

describe('guarded navigation', () => {
  it('blocks direct preview routes to quiz, ending and epilogue', () => {
    const game = createInitialState('an')
    const attempt = submitted('an', 10)
    const progress = emptyProgress()
    for (const requested of ['ending', 'quiz', 'epilogue'] as const) {
      expect(resolveScreen(requested, game, attempt, progress, 'an', stories)).toBe('landing')
    }
  })

  it('blocks unresolved/negative quizzes and a positive ending with another role attempt', () => {
    for (const answers of ['CBCC', 'CCCC']) {
      const game = finish('an', answers)
      expect(resolveScreen('quiz', game, submitted('an', 10), emptyProgress(), null, stories)).toBe('ending')
    }
    const positive = finish('an', 'AAAA')
    expect(isEligibleAttempt(positive, createQuizState('khai'), stories)).toBe(false)
    expect(resolveScreen('quiz', positive, createQuizState('khai'), emptyProgress(), null, stories)).toBe('ending')
    expect(resolveScreen('quiz', positive, createQuizState('an'), emptyProgress(), null, stories)).toBe('quiz')
  })

  it('opens only the passed role epilogue, including historic review from a new game', () => {
    const game = finish('an', 'AAAA')
    const quiz = submitted('an', 9)
    const progress = recordQuizPass(emptyProgress(), game, quiz, stories)
    expect(resolveScreen('epilogue', game, quiz, progress, 'an', stories)).toBe('epilogue')
    expect(resolveScreen('epilogue', game, quiz, progress, 'khai', stories)).toBe('landing')
    expect(resolveScreen('epilogue', game, quiz, progress, null, stories)).toBe('landing')
    expect(resolveScreen('epilogue', createInitialState('khai'), createQuizState('khai'), progress, 'an', stories)).toBe('epilogue')
  })

  it('always allows support regardless of ending or quiz score', () => {
    for (const game of [createInitialState('an'), finish('an', 'CCCC'), finish('khai', 'CBBA')]) {
      for (const score of [0, 8, 9, 10]) expect(resolveScreen('support', game, submitted(game.role, score), emptyProgress(), null, stories)).toBe('support')
    }
  })
})

describe('versioned storage and graceful fallback', () => {
  it('round-trips only role flags and omits answers, scores and extra fields', () => {
    const values = new Map<string, string>()
    const storage: ProgressStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value) } }
    const progress = recordQuizPass(emptyProgress(), finish('an', 'AAAA'), submitted('an', 9), stories)
    expect(saveProgress({ ...progress, ...{ answers: answersFor(9), correctCount: 9 } }, () => storage)).toBe(true)
    expect(PROGRESS_KEY).toMatch(/v1$/)
    expect([...values.keys()]).toEqual([PROGRESS_KEY])
    expect(JSON.parse(values.get(PROGRESS_KEY)!)).toEqual(progress)
    expect(loadProgress(() => storage)).toEqual(progress)
  })

  it('handles blocked storage getters, reads, quota writes, or missing storage', () => {
    const blocked = () => { throw new Error('Storage blocked') }
    const readBlocked: ProgressStorage = { getItem: blocked, setItem: () => {} }
    const writeBlocked: ProgressStorage = { getItem: () => null, setItem: blocked }
    for (const access of [blocked, () => readBlocked, () => null]) expect(loadProgress(access)).toEqual(emptyProgress())
    for (const access of [blocked, () => writeBlocked, () => null]) expect(saveProgress(emptyProgress(), access)).toBe(false)
    const inMemory = recordQuizPass(emptyProgress(), finish('an', 'AAAA'), submitted('an', 9), stories)
    saveProgress(inMemory, () => writeBlocked)
    expect(canViewEpilogue(inMemory, 'an')).toBe(true)
  })

  it('sanitizes corrupt JSON and invalid flag shapes without granting achievements', () => {
    expect(loadProgress(() => ({ getItem: () => '{broken', setItem: () => {} }))).toEqual(emptyProgress())
    for (const value of [null, [], 'text', { completedRoles: true }, { completedRoles: { an: 'true' }, quizPassedRoles: { an: true } }, { quizPassedRoles: { an: true } }]) {
      expect(parseProgress(value)).toEqual(emptyProgress())
    }
    expect(parseProgress({ completedRoles: { an: true, khai: false }, quizPassedRoles: { an: true, khai: true, other: true } })).toEqual({ completedRoles: { an: true, khai: false }, quizPassedRoles: { an: true, khai: false } })
  })
})
