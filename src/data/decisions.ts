import type { NarrativeChoice, Role } from '../types/narrative'

// Canonical choice text/effects from docs/BRANCHES_AND_STATE.md. No story expansion.
export const decisions = {
  an: [
    [
      { id: 'an_1_A', text: 'Lưu bằng chứng rồi tạm đóng nhóm', effect: { safety: 1, setFlags: ['evidenceSaved'] } },
      { id: 'an_1_B', text: 'Nói rõ “mình không đồng ý”', effect: { setFlags: ['boundarySet'] } },
      { id: 'an_1_C', text: 'Rời màn hình để bình tĩnh', effect: { setFlags: ['steppedAway'] } },
    ],
    [
      { id: 'an_2_A', text: 'Nhắn người lớn đáng tin cậy', effect: { support: 2, setFlags: ['adultNotified'] } },
      { id: 'an_2_B', text: 'Tâm sự với Mai', effect: { support: 1, setFlags: ['confidedMai'] } },
      { id: 'an_2_C', text: 'Chưa sẵn sàng chia sẻ', effect: { setFlags: ['needsTime'] } },
    ],
    [
      { id: 'an_3_A', text: 'Yêu cầu Mai ngừng phát tán và giữ bản gốc làm bằng chứng', effect: { safety: 1, setFlags: ['containClip'] } },
      { id: 'an_3_B', text: 'Đề nghị Mai đi cùng đến gặp cô Hương', effect: { support: 1, safety: 1, setFlags: ['teacherInformed'] } },
      { id: 'an_3_C', text: 'Chưa muốn trò chuyện với Mai', effect: { setFlags: ['distance'] } },
    ],
    [
      { id: 'an_4_A', text: 'Đề nghị cô Hương lên kế hoạch bảo vệ cụ thể', effect: { support: 1, safety: 1, setFlags: ['safetyPlan'] } },
      { id: 'an_4_B', text: 'Gửi bản tường trình riêng và đề nghị không đối mặt trực tiếp', effect: { support: 1, safety: 1, setFlags: ['writtenStatement'] } },
      { id: 'an_4_C', text: 'Cần thêm thời gian trước khi trao đổi', effect: { setFlags: ['needMoreTime'] } },
    ],
  ],
  khai: [
    [
      { id: 'khai_1_A', text: 'Hùa theo bình luận ác ý', effect: { escalation: 2, setFlags: ['joinMockery'] } },
      { id: 'khai_1_B', text: 'Bỏ mặc video tiếp tục lan', effect: { escalation: 1, setFlags: ['ignoredClip'] } },
      { id: 'khai_1_C', text: 'Yêu cầu ngừng chia sẻ', effect: { accountability: 1, setFlags: ['stopForwarding'] } },
    ],
    [
      { id: 'khai_2_A', text: 'Đổ lỗi cho An đã làm quá', effect: { escalation: 1, setFlags: ['blameShift'] } },
      { id: 'khai_2_B', text: 'Lắng nghe Mai nói về ảnh hưởng của clip', effect: { accountability: 1, setFlags: ['heardMai'] } },
      { id: 'khai_2_C', text: 'Hỏi Mai đoạn clip có đầy đủ ngữ cảnh không', effect: { accountability: 1, setFlags: ['askedContext'] } },
    ],
    [
      { id: 'khai_3_A', text: 'Phủ nhận mình gây tổn thương', effect: { escalation: 1, setFlags: ['denied'] } },
      { id: 'khai_3_B', text: 'Thừa nhận hành vi chế giễu là sai', effect: { accountability: 1, setFlags: ['admitted'] } },
      { id: 'khai_3_C', text: 'Đề nghị cô Hương kiểm tra lại cả sự kiện và cùng chịu trách nhiệm', effect: { accountability: 1, setFlags: ['acceptedRecord'] } },
    ],
    [
      { id: 'khai_4_A', text: 'Hợp tác gỡ clip, yêu cầu dừng phát tán và thực hiện kế hoạch khắc phục phù hợp', effect: { accountability: 2, setFlags: ['repairAction'] } },
      { id: 'khai_4_B', text: 'Chỉ đề nghị xin lỗi riêng, chưa có biện pháp tiếp theo', effect: { accountability: 1, setFlags: ['apologyOffered'] } },
      { id: 'khai_4_C', text: 'Tiếp tục đổ lỗi và né tránh', effect: { escalation: 2, setFlags: ['deflected'] } },
    ],
  ],
} as const satisfies Record<Role, readonly (readonly NarrativeChoice[])[]>
