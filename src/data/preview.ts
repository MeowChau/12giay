import type { CharacterPreview, EndingPreview, Screen } from '../types/ui'

// Presentation fixtures only. No choice effects, answer keys, scores, or persistence.
export const previewScreens: { id: Exclude<Screen, 'support'>; label: string }[] = [
  { id: 'warning', label: 'Cảnh báo' },
  { id: 'landing', label: 'Trang đầu' },
  { id: 'roles', label: 'Góc nhìn' },
  { id: 'story', label: 'Câu chuyện' },
  { id: 'ending', label: 'Kết thúc' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'epilogue', label: 'Epilogue' },
]

export const characters: CharacterPreview[] = [
  { id: 'an', name: 'An', number: '01', subtitle: 'Ở phía bên kia tiếng cười', description: 'Một học sinh đang tìm lại cảm giác an toàn. Nhìn câu chuyện qua những điều An cảm nhận và những ranh giới cần được tôn trọng.' },
  { id: 'khai', name: 'Khải', number: '02', subtitle: 'Nhìn lại điều mình đã làm', description: 'Một học sinh đối diện với hành vi gây tổn thương của mình. Hiểu thêm một góc nhìn, cùng trách nhiệm không thể bỏ qua.' },
]

export const endingPreviews: Record<EndingPreview, { label: string; title: string; text: string; number: string }> = {
  positive: { label: 'Kết thúc tích cực', title: 'Một khởi đầu khác.', text: 'Trách nhiệm, ranh giới, hỗ trợ và những hành động tiếp diễn. Thay đổi không có nghĩa là mọi chuyện lập tức tốt đẹp.', number: '01' },
  unresolved: { label: 'Kết thúc chưa giải quyết', title: 'Câu chuyện còn tiếp.', text: 'Sự hỗ trợ vẫn có thể bắt đầu. Người lớn và nhà trường có trách nhiệm bảo vệ người bị bắt nạt.', number: '02' },
  negative: { label: 'Kết thúc chưa được xử lý', title: 'Đừng để im lặng kéo dài.', text: 'Người gây hại, người chứng kiến và những người có trách nhiệm cần ngăn hành vi tiếp diễn. Đây không phải lỗi của An.', number: '03' },
}

export const supportContent = {
  title: 'Bạn không cần đối diện với bạo lực học đường một mình.',
  text: 'Nếu bạn đang bị bắt nạt hoặc chứng kiến người khác bị bắt nạt, hãy ưu tiên an toàn, nói với giáo viên, cha mẹ, người chăm sóc hoặc người lớn đáng tin cậy. Nếu an toàn, lưu bằng chứng, báo cáo nội dung gây hại và không phát tán lại. Khi nguy hiểm cấp bách, tìm trợ giúp khẩn cấp tại nơi bạn sống.',
  links: [
    { label: 'UNICEF Việt Nam', detail: 'Tìm hiểu về bắt nạt trên mạng', href: 'https://www.unicef.org/vietnam/endviolence/cyberbullying-what-it-and-how-stop-it' },
    { label: 'StopBullying.gov', detail: 'Cách báo cáo nội dung gây hại', href: 'https://www.stopbullying.gov/cyberbullying/how-to-report' },
  ],
}

export const reassurance = 'Bạn không có lỗi khi bị bắt nạt. Nếu đang bị tổn thương, hãy tìm người lớn đáng tin cậy hoặc kênh hỗ trợ tại nơi bạn sống.'
