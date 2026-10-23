/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { canAdvance, createInitialState, gameReducer, getCurrentLine, getCurrentScene, getEnding, getRoute, getSelectedChoice } from '../engine/narrative'
import type { EndingType, GameState, StoryCatalog, StoryLine } from '../types/narrative'
import { anEndings, anStory } from './anStory'
import { decisions } from './decisions'
import { demoStories } from './demoStory'
import { stories } from './stories'

const script = readFileSync(new URL('../../../docs/STORY_SCRIPT.md', import.meta.url), 'utf8')
const anScript = script.slice(script.indexOf('## Tuyến An'), script.indexOf('## Tuyến Khải'))
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()
const sceneBlocks = [...anScript.matchAll(/### `(an_[^`]+)`[^\n]*\n([\s\S]*?)(?=\n### |$)/g)]

function playAn(answers: string, catalog: StoryCatalog = stories) {
  let state = createInitialState('an')
  let answerIndex = 0
  const visited: { sceneId: string; line: StoryLine }[] = []
  for (let step = 0; step < 250; step++) {
    const scene = getCurrentScene(state, catalog)!
    if (getRoute(state, catalog).screen === 'ending') return { state, visited }
    const currentLine = getCurrentLine(state, catalog)!
    expect(currentLine).toBeDefined()
    visited.push({ sceneId: state.sceneId, line: currentLine })
    if (scene.kind === 'decision' && !getSelectedChoice(state, scene) && state.lineIndex === scene.lines.length - 1) {
      state = gameReducer(state, { type: 'choose', sceneId: scene.id, choiceId: `${scene.id}_${answers[answerIndex++]}` }, catalog)
    } else {
      expect(canAdvance(state, catalog)).toBe(true)
      const next = gameReducer(state, { type: 'advance', sceneId: state.sceneId, lineIndex: state.lineIndex }, catalog)
      expect(next).not.toBe(state)
      state = next
    }
  }
  throw new Error('An route did not terminate')
}

describe('An canonical content', () => {
  it('includes every An scene and every spoken/thought line in source order', () => {
    expect(sceneBlocks).toHaveLength(6)
    expect(anStory.scenes.map(scene => scene.id)).toEqual(['an_intro', 'an_1', 'an_2', 'an_3', 'an_4', 'an_reveal', 'an_ending'])
    for (const [, id, block] of sceneBlocks) {
      const scene = anStory.scenes.find(item => item.id === id)!
      const actual = normalize(scene.lines.map(line => line.text).join(' '))
      let offset = 0
      const dialogue = [...block.matchAll(/^- (?:AN|KHẢI|MAI|CÔ HƯƠNG)(?: \([^)]*\))?: “(.+)”$/gm)]
      expect(dialogue.length).toBeGreaterThan(0)
      for (const match of dialogue) {
        const expected = normalize(match[1])
        const position = actual.indexOf(expected, offset)
        expect(position, `${id}: missing or reordered ${expected}`).toBeGreaterThanOrEqual(offset)
        offset = position + expected.length
      }
    }
  })

  it('preserves the chat text and twelve source responses, with unchanged choice effects', () => {
    expect(anStory.scenes.find(scene => scene.id === 'an_1')?.lines.map(line => line.text)).toEqual(expect.arrayContaining([
      'Lớp trưởng diễn hài đỉnh thế =)))', 'Ai gửi tiếp cho nhóm bên kia chưa?',
    ]))
    for (let index = 0; index < 4; index++) {
      const block = sceneBlocks.find(match => match[1] === `an_${index + 1}`)![2]
      const responses = [...block.matchAll(/^- RESPONSE ([ABC]): “(.+)”$/gm)]
      const scene = anStory.scenes.find(item => item.id === `an_${index + 1}`)!
      expect(responses).toHaveLength(3)
      expect(scene.choices).toHaveLength(3)
      scene.choices!.forEach((choice, optionIndex) => {
        expect(choice.id).toBe(decisions.an[index][optionIndex].id)
        expect(choice.text).toBe(decisions.an[index][optionIndex].text)
        expect(choice.effect).toBe(decisions.an[index][optionIndex].effect)
        const expected = responses[optionIndex][2].replace(/^Cô Hương: '(.*)'$/, '$1')
        expect(normalize(choice.response!.map(line => line.text).join(' '))).toBe(normalize(expected))
      })
    }
  })

  it('keeps exact An text for all three endings', () => {
    for (const kind of ['positive', 'unresolved', 'negative'] as const) {
      const block = script.slice(script.indexOf(`### \`${kind}\``)).split('\n### ')[0]
      const expected = /\*\*An:\*\* “([^”]+)”/.exec(block)![1]
      expect(anEndings[kind]).toBe(expected)
    }
  })

  it('provides valid metadata, unique IDs, and at most two sentences per dialogue box', () => {
    const lines = anStory.scenes.flatMap(scene => [...scene.lines, ...(scene.choices?.flatMap(choice => choice.response ?? []) ?? [])])
    expect(new Set(lines.map(line => line.id)).size).toBe(lines.length)
    for (const line of lines) {
      expect(line.speaker).toBeTruthy()
      expect(line.background).toBeTruthy()
      expect(['thought', 'dialogue', 'narration']).toContain(line.type)
      expect((line.text.match(/[.!?](?=\s|$|['”])/g) ?? []).length, line.id).toBeLessThanOrEqual(2)
    }
  })

  it('reveals 29 seconds only at the reveal and preserves the original chronology and protections', () => {
    const before = anStory.scenes.slice(0, 5).flatMap(scene => [...scene.lines, ...(scene.choices?.flatMap(choice => choice.response ?? []) ?? [])])
    expect(before.map(line => `${line.text} ${line.evidence?.detail ?? ''}`).join(' ')).not.toMatch(/29|hai mươi chín/)
    const freezeFrame = anStory.scenes[0].lines.find(line => line.evidence)!
    expect(freezeFrame.evidence?.detail).toBe('00:12')
    const reveal = anStory.scenes.find(scene => scene.id === 'an_reveal')!
    const text = reveal.lines.map(line => line.text).join(' ')
    expect(text).toContain('Video được gửi trong lớp dài mười hai giây. Bản Mai quay dài hai mươi chín giây.')
    expect(text).toContain('Em đã tự ý cắt và gửi đoạn ngắn.')
    expect(text).toContain('suốt tám tháng')
    expect(text).toContain('không ép chạm mặt')
    expect(reveal.location).toContain('Biên bản')
    expect(reveal.lines.every(line => !line.portrait)).toBe(true)
    expect(anStory.scenes.find(scene => scene.id === 'an_4')?.choices?.[2].response?.[0].text).toContain('Cô vẫn cần thực hiện trách nhiệm bảo vệ em ngay từ lúc này.')
  })

  it('keeps the canonical An story in the active catalog', () => {
    expect(stories.an).toBe(anStory)
  })
})

describe('An responses and progression', () => {
  it.each([['AAAA', 'positive'], ['CBCC', 'unresolved'], ['CCCC', 'negative']] as const)('%s reaches %s after all reveal lines', (answers, expected) => {
    const { state, visited } = playAn(answers)
    expect(getEnding(state)).toBe(expected)
    expect(getRoute(state, stories)).toEqual({ screen: 'ending', endingType: expected })
    expect(state.appliedChoiceIds).toHaveLength(4)
    expect(visited.filter(item => item.sceneId === 'an_reveal').map(item => item.line)).toEqual(anStory.scenes.find(scene => scene.id === 'an_reveal')!.lines)
  })

  it('keeps all 81 An paths identical in scores, flags, and ending to the original engine demo', () => {
    const endings = new Set<EndingType>()
    for (const a of 'ABC') for (const b of 'ABC') for (const c of 'ABC') for (const d of 'ABC') {
      const answers = a + b + c + d
      const { state } = playAn(answers)
      expect(state).toEqual(playAn(answers, demoStories).state)
      endings.add(getEnding(state))
    }
    expect([...endings].sort()).toEqual(['negative', 'positive', 'unresolved'])
  })

  it.each([1, 2, 3, 4])('decision %i immediately shows the selected response and requires reading every box', node => {
    const scene = anStory.scenes.find(item => item.id === `an_${node}`)!
    for (const choice of scene.choices!) {
      const initial: GameState = { ...createInitialState('an'), sceneId: scene.id, lineIndex: scene.lines.length - 1 }
      const action = { type: 'choose', sceneId: scene.id, choiceId: choice.id } as const
      let state = gameReducer(initial, action, stories)
      const snapshot = structuredClone(state)
      expect(getCurrentLine(state, stories)).toBe(choice.response![0])
      expect(gameReducer(state, action, stories)).toBe(state)
      expect(gameReducer(state, { ...action, choiceId: scene.choices![0].id }, stories)).toBe(state)
      expect(gameReducer(state, { type: 'advance', sceneId: initial.sceneId, lineIndex: initial.lineIndex }, stories)).toBe(state)
      for (const response of choice.response!) {
        expect(state.sceneId).toBe(scene.id)
        expect(getCurrentLine(state, stories)).toBe(response)
        state = gameReducer(state, { type: 'advance', sceneId: state.sceneId, lineIndex: state.lineIndex }, stories)
      }
      expect(state.sceneId).toBe(scene.nextSceneId)
      expect(state.appliedChoiceIds).toEqual([choice.id])
      expect(state.flags).toEqual(snapshot.flags)
      expect([state.support, state.safety]).toEqual([snapshot.support, snapshot.safety])
    }
  })
})
