import { decisions } from './decisions'
import type { NarrativeScene, Role, StoryCatalog, StoryLine } from '../types/narrative'

// Short structural placeholders only. Full dialogue belongs to stages 05 and 06.
const decisionBackgrounds = ['chatroom', 'classroom', 'hallway', 'teacherroom'] as const
const decisionTitles = ['Lựa chọn 01', 'Lựa chọn 02', 'Lựa chọn 03', 'Lựa chọn 04']

function makeDemoScenes(role: Role): NarrativeScene[] {
  const speaker = role === 'an' ? 'An' : 'Khải'
  const line = (id: string, text: string, type: StoryLine['type'] = 'narration'): StoryLine => ({ id, speaker: type === 'narration' ? 'Dấu chân' : speaker, text, type })
  return [
    {
      id: `${role}_intro`, role, kind: 'intro', title: 'Tiếng cười', location: 'Hành lang · Thứ Sáu',
      background: 'hallway', portrait: role,
      lines: [line(`${role}_intro_1`, 'Một đoạn video không thể kể hết câu chuyện của một con người.')],
      nextSceneId: `${role}_1`,
    },
    ...decisions[role].map((choices, index): NarrativeScene => ({
      id: `${role}_${(index + 1) as 1 | 2 | 3 | 4}`, role, kind: 'decision',
      title: decisionTitles[index], location: 'Bản demo lựa chọn', background: decisionBackgrounds[index], portrait: role,
      lines: [line(`${role}_${index + 1}_line`, decisionTitles[index])],
      choices,
      nextSceneId: index === 3 ? `${role}_reveal` : `${role}_${(index + 2) as 2 | 3 | 4}`,
    })),
    {
      id: `${role}_reveal`, role, kind: 'reveal', title: 'Sự thật ngoài khung hình',
      location: 'Phòng trao đổi · Thứ Ba', background: 'teacherroom', portrait: role,
      lines: [
        line(`${role}_reveal_1`, 'Bản gốc 29 giây · Đoạn cắt 12 giây · Mai chia sẻ đầu tiên.'),
        line(`${role}_reveal_2`, 'Poster tám tháng trước chỉ có tên An đại diện; hồ sơ gốc ghi tên cả An và Khải.'),
      ],
      nextSceneId: `${role}_ending`,
    },
    {
      id: `${role}_ending`, role, kind: 'ending', title: 'Kết thúc', location: '', background: 'classroom',
      lines: [line(`${role}_ending_1`, 'Trách nhiệm, ranh giới và sự hỗ trợ.')],
    },
  ]
}

export const demoStories: StoryCatalog = {
  an: { role: 'an', scenes: makeDemoScenes('an') },
  khai: { role: 'khai', scenes: makeDemoScenes('khai') },
}
