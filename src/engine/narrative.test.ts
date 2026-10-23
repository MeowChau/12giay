/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { decisions } from '../data/decisions'
import { demoStories } from '../data/demoStory'
import type { ChoiceEffect, EndingType, GameAction, GameState, Role, StoryCatalog } from '../types/narrative'
import { advanceScene, applyChoice, canAdvance, createInitialState, gameReducer, getCurrentScene, getEnding, getRoute, getSelectedChoice } from './narrative'

const reduce = (state: GameState, action: GameAction) => gameReducer(state, action, demoStories)
const next = (state: GameState) => reduce(state, { type: 'advance', sceneId: state.sceneId, lineIndex: state.lineIndex })

function play(role: Role, answers: string) {
  let state = createInitialState(role)
  let answerIndex = 0
  const visited: string[] = []
  for (let step = 0; step < 40; step++) {
    const scene = getCurrentScene(state, demoStories)!
    expect(scene).toBeDefined()
    expect(scene.lines[state.lineIndex]).toBeDefined()
    visited.push(`${state.sceneId}:${state.lineIndex}`)
    if (scene.kind === 'ending') return { state, visited }
    if (scene.kind === 'decision' && state.lineIndex === scene.lines.length - 1 && !getSelectedChoice(state, scene)) {
      const choiceId = `${scene.id}_${answers[answerIndex++]}`
      const chosen = reduce(state, { type: 'choose', sceneId: scene.id, choiceId })
      expect(chosen).not.toBe(state)
      state = chosen
    }
    const advanced = next(state)
    expect(advanced).not.toBe(state)
    state = advanced
  }
  throw new Error('Story did not reach an ending within its bounded traversal')
}

describe('canonical data', () => {
  it('matches every choice label, score effect, and flag to the source document', () => {
    const doc = readFileSync(new URL('../../../docs/BRANCHES_AND_STATE.md', import.meta.url), 'utf8')
    for (const role of ['an', 'khai'] as const) {
      expect(decisions[role]).toHaveLength(4)
      decisions[role].forEach((node, index) => {
        const row = doc.split('\n').find(value => value.startsWith(`| \`${role}_${index + 1}\` |`))!
        expect(row).toBeDefined()
        const cells = row.split('|').slice(2, 5).map(cell => cell.trim())
        expect(node).toHaveLength(3)
        node.forEach((choice, optionIndex) => {
          const cell = cells[optionIndex]
          const effect: ChoiceEffect = {}
          for (const match of cell.matchAll(/`(support|safety|accountability|escalation)\+(\d+)/g)) {
            effect[match[1] as 'support' | 'safety' | 'accountability' | 'escalation'] = Number(match[2])
          }
          effect.setFlags = [...cell.matchAll(/`([a-zA-Z]+)`/g)].map(match => match[1]) as ChoiceEffect['setFlags']
          expect(choice.id).toBe(`${role}_${index + 1}_${'ABC'[optionIndex]}`)
          expect(choice.text).toBe(cell.slice(0, cell.indexOf(' (')))
          expect(choice.effect).toEqual(effect)
        })
      })
    }
  })

  it.each(['an', 'khai'] as const)('%s has a closed graph, four decisions, and a mandatory reveal', role => {
    const scenes = demoStories[role].scenes
    expect(scenes.filter(scene => scene.kind === 'decision')).toHaveLength(4)
    expect(new Set(scenes.map(scene => scene.id)).size).toBe(scenes.length)
    for (const scene of scenes) {
      expect(scene.lines.length).toBeGreaterThan(0)
      expect(scene.lines.every(line => line.id && line.text)).toBe(true)
      if (scene.kind === 'ending') expect(scene.nextSceneId).toBeUndefined()
      else expect(scenes.some(nextScene => nextScene.id === scene.nextSceneId)).toBe(true)
    }
    expect(scenes.find(scene => scene.id === `${role}_4`)?.nextSceneId).toBe(`${role}_reveal`)
    expect(scenes.find(scene => scene.id === `${role}_reveal`)?.nextSceneId).toBe(`${role}_ending`)
  })
})

describe('reducer acceptance vectors', () => {
  const vectors = [
    ['an', 'AAAA', 'positive'], ['an', 'CBCC', 'unresolved'], ['an', 'CCCC', 'negative'],
    ['khai', 'CBBA', 'positive'], ['khai', 'BBAB', 'unresolved'], ['khai', 'AAAC', 'negative'],
  ] as const
  it.each(vectors)('%s %s => %s', (role, answers, expected) => {
    const { state, visited } = play(role, answers)
    expect(getEnding(state)).toBe(expected)
    expect(getRoute(state, demoStories)).toEqual({ screen: 'ending', endingType: expected })
    expect(state.appliedChoiceIds).toHaveLength(4)
    expect(visited).toContain(`${role}_reveal:0`)
    expect(visited).toContain(`${role}_reveal:1`)
  })

  it.each(['an', 'khai'] as const)('all 81 %s paths terminate without missing lines or unreachable endings', role => {
    const endings = new Set<EndingType>()
    for (const a of 'ABC') for (const b of 'ABC') for (const c of 'ABC') for (const d of 'ABC') {
      const { state, visited } = play(role, a + b + c + d)
      endings.add(getEnding(state))
      expect(state.sceneId).toBe(`${role}_ending`)
      expect(state.appliedChoiceIds).toHaveLength(4)
      expect(new Set(state.flags).size).toBe(state.flags.length)
      expect(visited).toContain(`${role}_reveal:0`)
      expect(visited).toContain(`${role}_reveal:1`)
      expect(next(state)).toBe(state)
      if (role === 'an') expect([state.accountability, state.escalation]).toEqual([0, 0])
      else expect([state.support, state.safety]).toEqual([0, 0])
    }
    expect([...endings].sort()).toEqual(['negative', 'positive', 'unresolved'])
  })
})

describe('choice locking and navigation', () => {
  it.each(['an', 'khai'] as const)('initializes %s with independent, empty state', role => {
    const first = createInitialState(role)
    const second = createInitialState(role)
    expect(first).toEqual({ role, sceneId: `${role}_intro`, lineIndex: 0, support: 0, safety: 0, accountability: 0, escalation: 0, flags: [], appliedChoiceIds: [] })
    expect(first.flags).not.toBe(second.flags)
    expect(first.appliedChoiceIds).not.toBe(second.appliedChoiceIds)
  })

  it('blocks Next until a choice has been committed', () => {
    const state = next(createInitialState('an'))
    expect(canAdvance(state, demoStories)).toBe(false)
    expect(next(state)).toBe(state)
  })

  it('ignores double-clicks, alternative options on the same node, and stale events', () => {
    const initial = next(createInitialState('an'))
    const before = structuredClone(initial)
    const action: GameAction = { type: 'choose', sceneId: 'an_1', choiceId: 'an_1_A' }
    const chosen = reduce(initial, action)
    expect(initial).toEqual(before)
    expect(chosen.safety).toBe(1)
    expect(chosen.flags).toEqual(['evidenceSaved'])
    expect(reduce(chosen, action)).toBe(chosen)
    expect(reduce(chosen, { ...action, choiceId: 'an_1_B' })).toBe(chosen)
    const advance: GameAction = { type: 'advance', sceneId: chosen.sceneId, lineIndex: chosen.lineIndex }
    const advanced = reduce(chosen, advance)
    expect(advanced.sceneId).toBe('an_2')
    expect(reduce(advanced, action)).toBe(advanced)
    expect(reduce(advanced, advance)).toBe(advanced)
    expect(advanced.safety).toBe(1)
  })

  it('rejects unknown, future, wrong-role options and wrong scene IDs', () => {
    const state = next(createInitialState('an'))
    for (const choiceId of ['unknown', 'an_2_A', 'khai_1_A']) {
      expect(applyChoice(state, 'an_1', choiceId, demoStories)).toBe(state)
    }
    expect(applyChoice(state, 'an_2', 'an_1_A', demoStories)).toBe(state)
    expect(applyChoice(createInitialState('an'), 'an_intro', 'an_1_A', demoStories)).toEqual(createInitialState('an'))
  })

  it('advances multi-line scenes one line at a time and rejects stale line events', () => {
    const { state: completed } = play('an', 'AAAA')
    const reveal: GameState = { ...completed, sceneId: 'an_reveal', lineIndex: 0 }
    expect(getRoute(reveal, demoStories)).toEqual({ screen: 'story' })
    const secondLine = next(reveal)
    expect(secondLine.sceneId).toBe('an_reveal')
    expect(secondLine.lineIndex).toBe(1)
    expect(advanceScene(secondLine, 'an_reveal', 0, demoStories)).toBe(secondLine)
    expect(next(secondLine).sceneId).toBe('an_ending')
  })

  it('only accepts a decision after its final line', () => {
    const state = next(createInitialState('an'))
    const custom = structuredClone(demoStories)
    const node = custom.an.scenes.find(scene => scene.id === 'an_1')!
    node.lines = [...node.lines, { ...node.lines[0], id: 'second-line' }]
    expect(applyChoice(state, 'an_1', 'an_1_A', custom)).toBe(state)
    const lastLine = advanceScene(state, state.sceneId, 0, custom)
    expect(lastLine.lineIndex).toBe(1)
    expect(applyChoice(lastLine, 'an_1', 'an_1_A', custom).safety).toBe(1)
  })

  it('safely rejects invalid line indexes or broken transitions', () => {
    for (const lineIndex of [-1, 5, 0.5]) {
      const state = { ...createInitialState('an'), lineIndex }
      expect(next(state)).toBe(state)
    }
    const custom: StoryCatalog = { ...demoStories, an: { role: 'an', scenes: [{ ...demoStories.an.scenes[0], nextSceneId: 'khai_intro' }] } }
    const state = createInitialState('an')
    expect(advanceScene(state, state.sceneId, 0, custom)).toBe(state)
  })

  it('replay resets all state and switching roles cannot carry flags or scores', () => {
    const { state } = play('an', 'AAAA')
    const snapshot = structuredClone(state)
    const replay = reduce(state, { type: 'reset' })
    const switched = reduce(state, { type: 'reset', role: 'khai' })
    expect(replay).toEqual(createInitialState('an'))
    expect(switched).toEqual(createInitialState('khai'))
    expect(replay.flags).not.toBe(state.flags)
    expect(switched.appliedChoiceIds).not.toBe(state.appliedChoiceIds)
    expect(reduce(switched, { type: 'choose', sceneId: 'an_1', choiceId: 'an_1_A' })).toBe(switched)
    expect(state).toEqual(snapshot)
  })
})

describe('ending thresholds', () => {
  const cases: [Role, Partial<GameState>, EndingType][] = [
    ['an', { support: 2, safety: 2, flags: ['safetyPlan'] }, 'positive'],
    ['an', { support: 2, safety: 2, flags: ['writtenStatement'] }, 'positive'],
    ['an', { support: 2, safety: 2, flags: ['teacherInformed'] }, 'positive'],
    ['an', { support: 2, safety: 2 }, 'unresolved'],
    ['an', { support: 1, safety: 2, flags: ['safetyPlan'] }, 'unresolved'],
    ['an', { support: 2, safety: 1, flags: ['safetyPlan'] }, 'unresolved'],
    ['an', { safety: 1 }, 'unresolved'],
    ['an', {}, 'negative'],
    ['khai', { accountability: 3, escalation: 1, flags: ['repairAction'] }, 'positive'],
    ['khai', { accountability: 3, escalation: 2, flags: ['repairAction'] }, 'unresolved'],
    ['khai', { accountability: 2, escalation: 1, flags: ['repairAction'] }, 'unresolved'],
    ['khai', { accountability: 3, escalation: 1 }, 'unresolved'],
    ['khai', { accountability: 1, escalation: 5 }, 'unresolved'],
    ['khai', { accountability: 0, escalation: 2 }, 'unresolved'],
    ['khai', { accountability: 0, escalation: 3 }, 'negative'],
  ]
  it.each(cases)('%s %j => %s', (role, patch, expected) => {
    const state = { ...createInitialState(role), ...patch }
    expect(getEnding(state)).toBe(expected)
    expect(getEnding(state)).toBe(expected)
  })
})
