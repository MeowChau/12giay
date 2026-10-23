/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { canAdvance, createInitialState, gameReducer, getCurrentLine, getCurrentScene, getEnding, getRoute, getSelectedChoice } from '../engine/narrative'
import type { EndingType, GameState, Role, StoryCatalog, StoryLine } from '../types/narrative'
import { anStory } from './anStory'
import { decisions } from './decisions'
import { demoStories } from './demoStory'
import { khaiEndings, khaiStory } from './khaiStory'
import { stories } from './stories'

const script = readFileSync(new URL('../../../docs/STORY_SCRIPT.md', import.meta.url), 'utf8')
const khaiScript = script.slice(script.indexOf('## Tuyến Khải'), script.indexOf('## 3 ending'))
const sceneBlocks = [...khaiScript.matchAll(/### `(khai_[^`]+)`[^\n]*\n([\s\S]*?)(?=\n### |$)/g)]
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()

function play(role: Role, answers: string, catalog: StoryCatalog = stories, initial = createInitialState(role)) {
  let state = initial
  let answerIndex = 0
  const visited: { sceneId: string; line: StoryLine }[] = []
  expect(state.role).toBe(role)
  for (let step = 0; step < 250; step++) {
    const scene = getCurrentScene(state, catalog)!
    expect(scene).toBeDefined()
    if (getRoute(state, catalog).screen === 'ending') return { state, visited }
    const currentLine = getCurrentLine(state, catalog)!
    expect(currentLine).toBeDefined()
    visited.push({ sceneId: state.sceneId, line: currentLine })
    if (scene.kind === 'decision' && !getSelectedChoice(state, scene) && state.lineIndex === scene.lines.length - 1) {
      const chosen = gameReducer(state, { type: 'choose', sceneId: scene.id, choiceId: `${scene.id}_${answers[answerIndex++]}` }, catalog)
      expect(chosen).not.toBe(state)
      state = chosen
    } else {
      expect(canAdvance(state, catalog)).toBe(true)
      const next = gameReducer(state, { type: 'advance', sceneId: state.sceneId, lineIndex: state.lineIndex }, catalog)
      expect(next).not.toBe(state)
      state = next
    }
  }
  throw new Error('Story did not reach an ending')
}

describe('Khải canonical content', () => {
  it('keeps every scene and every dialogue/thought in script order', () => {
    expect(sceneBlocks).toHaveLength(6)
    expect(khaiStory.scenes.map(scene => scene.id)).toEqual(['khai_intro', 'khai_1', 'khai_2', 'khai_3', 'khai_4', 'khai_reveal', 'khai_ending'])
    for (const [, id, block] of sceneBlocks) {
      const scene = khaiStory.scenes.find(item => item.id === id)!
      const actual = normalize(scene.lines.map(line => line.text).join(' '))
      const spoken = [...block.matchAll(/^- (?:\[Dòng thoại bị cắt xuất hiện\]: )?(?:AN|KHẢI|MAI|CÔ HƯƠNG|BẠN CÙNG LỚP)(?: \([^)]*\))?: “(.+)”$/gm)]
      expect(spoken.length).toBeGreaterThan(0)
      let offset = 0
      for (const match of spoken) {
        const expected = normalize(match[1])
        const position = actual.indexOf(expected, offset)
        expect(position, `${id}: missing or reordered ${expected}`).toBeGreaterThanOrEqual(offset)
        offset = position + expected.length
      }
    }
  })

  it('copies all 12 responses while retaining canonical choice IDs, labels and effects', () => {
    for (let index = 0; index < 4; index++) {
      const block = sceneBlocks.find(match => match[1] === `khai_${index + 1}`)![2]
      const responses = [...block.matchAll(/^- RESPONSE ([ABC]): “(.+)”$/gm)]
      const scene = khaiStory.scenes.find(item => item.id === `khai_${index + 1}`)!
      expect(responses).toHaveLength(3)
      expect(scene.choices).toHaveLength(3)
      scene.choices!.forEach((choice, optionIndex) => {
        expect(choice.id).toBe(decisions.khai[index][optionIndex].id)
        expect(choice.text).toBe(decisions.khai[index][optionIndex].text)
        expect(choice.effect).toBe(decisions.khai[index][optionIndex].effect)
        const expected = responses[optionIndex][2].replace(/^(?:Cô Hương|Khải): '(.*)'$/, '$1')
        expect(normalize(choice.response!.map(line => line.text).join(' '))).toBe(normalize(expected))
      })
    }
  })

  it('copies all three Khải endings exactly', () => {
    for (const kind of ['positive', 'unresolved', 'negative'] as const) {
      const block = script.slice(script.indexOf(`### \`${kind}\``)).split('\n### ')[0]
      expect(khaiEndings[kind]).toBe(/\*\*Khải:\*\* “([^”]+)”/.exec(block)![1])
    }
  })

  it('provides unique line IDs, metadata and at most two sentences per box', () => {
    const lines = khaiStory.scenes.flatMap(scene => [...scene.lines, ...(scene.choices?.flatMap(choice => choice.response ?? []) ?? [])])
    expect(new Set(lines.map(line => line.id)).size).toBe(lines.length)
    for (const line of lines) {
      expect(line.speaker).toBeTruthy()
      expect(line.background).toBeTruthy()
      expect(['thought', 'dialogue', 'narration']).toContain(line.type)
      expect((line.text.match(/[.!?](?=\s|$|['”])/g) ?? []).length, line.id).toBeLessThanOrEqual(2)
    }
  })

  it('preserves the three twists and the distinction between motive and responsibility', () => {
    const beforeReveal = khaiStory.scenes.slice(0, 5).flatMap(scene => [...scene.lines, ...(scene.choices?.flatMap(choice => choice.response ?? []) ?? [])])
    expect(beforeReveal.map(line => `${line.text} ${line.evidence?.detail ?? ''}`).join(' ')).not.toMatch(/29|hai mươi chín/)
    const intro = khaiStory.scenes[0].lines.map(line => line.text).join(' ')
    expect(intro).toContain('Tám tháng rồi.')
    expect(intro).toContain('chỉ có tên An')
    const fourth = khaiStory.scenes.find(scene => scene.id === 'khai_4')!.lines.map(line => line.text).join(' ')
    expect(fourth).toContain('Tớ là người đầu tiên gửi đoạn cắt vào nhóm.')
    expect(fourth).toContain('Em không thể yêu cầu điều đó.')
    const reveal = khaiStory.scenes.find(scene => scene.id === 'khai_reveal')!
    const text = reveal.lines.map(line => line.text).join(' ')
    expect(text).toContain('Đây là bản ghi gốc, hai mươi chín giây. Đoạn được lan truyền chỉ có mười hai giây.')
    expect(text).toContain('Em là người gửi đoạn cắt vào nhóm. Em nghĩ mình đang giúp.')
    expect(text).toContain('Nhưng em không có quyền tự ý đăng hình ảnh An.')
    expect(text).toContain('hồ sơ gốc ghi rõ cả An và Khải')
    expect(text).toContain("Chính tớ viết: 'Một đoạn video không thể kể hết câu chuyện của một con người.'")
    expect(text).toContain('Nhưng chuyện đó không cho phép ai hạ nhục người khác.')
    expect(text).toContain('An không buộc phải có mặt trực tiếp.')
    expect(reveal.lines.every(line => !line.portrait)).toBe(true)
    expect(khaiEndings.positive).toContain('chấp nhận việc An chưa muốn nói chuyện')
  })

  it('reuses the same event settings/evidence and keeps the An story intact', () => {
    expect(stories.an).toBe(anStory)
    expect(stories.khai).toBe(khaiStory)
    for (const suffix of ['intro', '1', '2', 'reveal']) {
      expect(khaiStory.scenes.find(scene => scene.id === `khai_${suffix}`)?.background).toBe(anStory.scenes.find(scene => scene.id === `an_${suffix}`)?.background)
    }
    const evidence = (role: Role) => stories[role].scenes.find(scene => scene.kind === 'reveal')!.lines.flatMap(line => line.evidence ? [line.evidence] : [])
    expect(evidence('khai').find(item => item.progress !== undefined)).toEqual(evidence('an').find(item => item.progress !== undefined))
    expect(evidence('khai').find(item => item.title === 'Ngoài khung hình')).toEqual(evidence('an').find(item => item.title === 'Ngoài khung hình'))
  })
})

describe('Khải progression and role independence', () => {
  it.each([['CBBA', 'positive'], ['BBAB', 'unresolved'], ['AAAC', 'negative']] as const)('%s => %s after the full mandatory reveal', (answers, expected) => {
    const { state, visited } = play('khai', answers)
    expect(getEnding(state)).toBe(expected)
    expect(getRoute(state, stories)).toEqual({ screen: 'ending', endingType: expected })
    expect(state.appliedChoiceIds).toHaveLength(4)
    expect(visited.filter(item => item.sceneId === 'khai_reveal').map(item => item.line)).toEqual(khaiStory.scenes.find(scene => scene.id === 'khai_reveal')!.lines)
  })

  it('terminates all 81 Khải paths with the original effects and endings', () => {
    const endings = new Set<EndingType>()
    for (const a of 'ABC') for (const b of 'ABC') for (const c of 'ABC') for (const d of 'ABC') {
      const answers = a + b + c + d
      const { state } = play('khai', answers)
      expect(state).toEqual(play('khai', answers, demoStories).state)
      endings.add(getEnding(state))
    }
    expect([...endings].sort()).toEqual(['negative', 'positive', 'unresolved'])
  })

  it.each([1, 2, 3, 4])('decision %i immediately shows each response without duplicate effects', node => {
    const scene = khaiStory.scenes.find(item => item.id === `khai_${node}`)!
    for (const choice of scene.choices!) {
      const initial: GameState = { ...createInitialState('khai'), sceneId: scene.id, lineIndex: scene.lines.length - 1 }
      const action = { type: 'choose', sceneId: scene.id, choiceId: choice.id } as const
      let state = gameReducer(initial, action, stories)
      const snapshot = structuredClone(state)
      expect(getCurrentLine(state, stories)).toBe(choice.response![0])
      expect(gameReducer(state, action, stories)).toBe(state)
      expect(gameReducer(state, { ...action, choiceId: scene.choices![0].id }, stories)).toBe(state)
      for (const response of choice.response!) {
        expect(getCurrentLine(state, stories)).toBe(response)
        state = gameReducer(state, { type: 'advance', sceneId: state.sceneId, lineIndex: state.lineIndex }, stories)
      }
      expect(state.sceneId).toBe(scene.nextSceneId)
      expect(state.flags).toEqual(snapshot.flags)
      expect([state.accountability, state.escalation]).toEqual([snapshot.accountability, snapshot.escalation])
      expect([state.support, state.safety]).toEqual([0, 0])
    }
  })

  const switches: [Role, string, Role, string, EndingType][] = [
    ['an', 'AAAA', 'khai', 'AAAC', 'negative'],
    ['an', 'CCCC', 'khai', 'CBBA', 'positive'],
    ['an', 'CBCC', 'khai', 'BBAB', 'unresolved'],
    ['khai', 'CBBA', 'an', 'CCCC', 'negative'],
    ['khai', 'AAAC', 'an', 'AAAA', 'positive'],
    ['khai', 'BBAB', 'an', 'CBCC', 'unresolved'],
  ]
  it.each(switches)('switch %s %s -> %s %s yields %s with unchanged facts', (firstRole, firstAnswers, secondRole, secondAnswers, expected) => {
    const catalogBefore = JSON.stringify(stories)
    const first = play(firstRole, firstAnswers).state
    const firstBefore = structuredClone(first)
    const reset = gameReducer(first, { type: 'reset', role: secondRole }, stories)
    expect(reset).toEqual(createInitialState(secondRole))
    expect(reset.flags).not.toBe(first.flags)
    expect(reset.appliedChoiceIds).not.toBe(first.appliedChoiceIds)
    const second = play(secondRole, secondAnswers, stories, reset)
    expect(getEnding(second.state)).toBe(expected)
    expect(second.state.appliedChoiceIds.every(id => id.startsWith(`${secondRole}_`))).toBe(true)
    expect(second.visited.filter(item => item.sceneId === `${secondRole}_reveal`).map(item => item.line)).toEqual(stories[secondRole].scenes.find(scene => scene.kind === 'reveal')!.lines)
    expect(first).toEqual(firstBefore)
    expect(JSON.stringify(stories)).toBe(catalogBefore)
  })
})
