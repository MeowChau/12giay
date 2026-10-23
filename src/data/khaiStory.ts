import { decisions } from './decisions'
import type { BackgroundId, EndingType, NarrativeChoice, NarrativeStory, PortraitId, StoryEvidence, StoryLine } from '../types/narrative'

// Canonical Khải text from docs/STORY_SCRIPT.md. Effects stay in decisions.ts.
function line(id: string, speaker: string, type: StoryLine['type'], text: string, background: BackgroundId, portrait?: PortraitId, evidence?: StoryEvidence): StoryLine {
  return { id, speaker, type, text, background, portrait, evidence }
}

const responses: readonly (readonly (readonly StoryLine[])[])[] = [
  [
    [line('khai_1_A_1', 'Người kể chuyện', 'narration', 'Một biểu tượng cười được thả xuống. Khải nhìn thấy số lần chuyển tiếp tăng lên.', 'chatroom', 'khai')],
    [line('khai_1_B_1', 'Khải', 'thought', 'Tớ đóng cuộc trò chuyện. Đoạn clip vẫn chạy tiếp mà không cần tớ.', 'chatroom', 'khai')],
    [line('khai_1_C_1', 'Khải', 'thought', "Tớ nhắn 'Dừng chia sẻ đi.' Một bạn hỏi lại: 'Sao lúc nãy cậu còn cười?'", 'chatroom', 'khai')],
  ],
  [
    [line('khai_2_A_1', 'Người kể chuyện', 'narration', "Mai không tranh cãi. Cô nói: 'Cậu không thể quyết định thay An rằng chuyện đó vô hại.'", 'classroom', 'mai')],
    [line('khai_2_B_1', 'Người kể chuyện', 'narration', 'Mai kể An đã bị bình luận cả cuối tuần. Khải không tìm được câu đùa nào hợp lúc này.', 'classroom', 'khai')],
    [
      line('khai_2_C_1', 'Người kể chuyện', 'narration', 'Mai im lặng trước câu hỏi.', 'classroom', 'mai'),
      line('khai_2_C_2', 'Mai', 'dialogue', "'Tớ có bản gốc. Và tớ phải nói chuyện với cô Hương.'", 'classroom', 'mai'),
    ],
  ],
  [
    [line('khai_3_A_1', 'Cô Hương', 'dialogue', 'Việc các bạn khác cười không thay đổi điều em đã nói.', 'classroom')],
    [line('khai_3_B_1', 'Người kể chuyện', 'narration', "Khải đặt điện thoại xuống: 'Em đã chế giễu An. Em không nên làm thế.'", 'classroom', 'khai')],
    [line('khai_3_C_1', 'Khải', 'dialogue', 'Xin cô xem đầy đủ. Em muốn biết sự thật, và em biết mình đã làm tổn thương bạn.', 'classroom', 'khai')],
  ],
  [
    [line('khai_4_A_1', 'Người kể chuyện', 'narration', 'Khải hỗ trợ cô Hương xác minh các bài đăng, đề nghị các bạn ngừng phát tán và đồng ý chịu trách nhiệm về hành vi của mình.', 'teacherroom', 'khai')],
    [line('khai_4_B_1', 'Người kể chuyện', 'narration', 'Khải soạn lời xin lỗi. Nhưng ngoài màn hình, bình luận vẫn còn ở đó.', 'teacherroom', 'khai')],
    [line('khai_4_C_1', 'Người kể chuyện', 'narration', 'Khải xóa cuộc trò chuyện khỏi máy. Nhưng những gì đã xảy ra không tự biến mất.', 'teacherroom', 'khai')],
  ],
]

function choices(index: number): readonly NarrativeChoice[] {
  return decisions.khai[index].map((choice, option) => ({ ...choice, response: responses[index][option] }))
}

export const khaiEndings: Record<EndingType, string> = {
  positive: 'Khải thừa nhận hành vi, hợp tác xử lý những bản chia sẻ và chấp nhận việc An chưa muốn nói chuyện. Việc làm đúng hôm nay không xóa ngày hôm qua. Nhưng nó đánh dấu lần đầu Khải không dùng tiếng cười của người khác để tránh trách nhiệm.',
  unresolved: 'Khải hiểu một phần hậu quả, nhưng chưa đi đủ xa để khắc phục. Lời xin lỗi, hoặc im lặng, không thay thế cho việc ngăn hành vi tiếp diễn. Một bước tiếp theo vẫn đang chờ được lựa chọn.',
  negative: 'Khải tiếp tục phủ nhận và để việc phát tán kéo dài. Những người xung quanh phải xử lý hậu quả của hành động mà Khải có thể đã ngăn lại. Sự im lặng không khiến trách nhiệm biến mất.',
}

export const khaiStory: NarrativeStory = {
  role: 'khai',
  scenes: [
    {
      id: 'khai_intro', role: 'khai', kind: 'intro', title: 'Chuyện cười ở hành lang', location: 'Hành lang · Thứ Sáu, 10:12', background: 'hallway', nextSceneId: 'khai_1',
      lines: [
        line('khai_intro_01', 'Khải', 'thought', 'Tớ nghe mọi người gọi An là người giỏi nhất lớp. Tám tháng rồi.', 'hallway', 'khai'),
        line('khai_intro_02', 'Khải', 'thought', 'Tấm poster vẫn nằm trên bảng tin, chỉ có tên An.', 'hallway', 'khai'),
        line('khai_intro_03', 'Tấm poster cũ', 'narration', "Tờ poster cũ, tên An rõ, phần 'nhóm thực hiện' bị khuất.", 'hallway', undefined, { title: 'Poster phim cũ', detail: 'Ngoài khung hình · An' }),
        line('khai_intro_04', 'Khải', 'thought', 'Tớ đã dựng video đó qua ba đêm. Một lời cảm ơn công khai cũng không có.', 'hallway', 'khai'),
        line('khai_intro_05', 'Người kể chuyện', 'narration', 'An làm rơi giấy, vài bạn nhìn theo.', 'hallway'),
        line('khai_intro_06', 'Khải', 'dialogue', 'Lớp trưởng mà vụng thế. Có cần đạo diễn cảnh này không?', 'hallway', 'khai'),
        line('khai_intro_07', 'Người kể chuyện', 'narration', 'Một số bạn cười.', 'hallway'),
        line('khai_intro_08', 'Khải', 'thought', 'Tiếng cười làm tớ cảm thấy mình có mặt. Rồi có một giây An nhìn thẳng vào tớ.', 'hallway', 'khai'),
        line('khai_intro_09', 'An', 'dialogue', 'Khải, dừng lại.', 'hallway', 'an'),
        line('khai_intro_10', 'Khải', 'thought', 'Tớ nghe. Nhưng khi đó tớ cố gắng không nghĩ đến nó.', 'hallway', 'khai'),
      ],
    },
    {
      id: 'khai_1', role: 'khai', kind: 'decision', title: '12 giây thành tin nhắn', location: 'Nhóm lớp · Thứ Sáu, 10:18', background: 'chatroom', nextSceneId: 'khai_2', choices: choices(0),
      lines: [
        line('khai_1_01', 'Nhóm lớp', 'narration', 'Video 12s, bình luận tiếp tục.', 'chatroom', undefined, { title: 'Nhóm lớp', detail: 'Video_12s.mp4 · 12 giây' }),
        line('khai_1_02', 'Khải', 'thought', 'Tớ không quay video. Nhưng tớ biết tiếng cười trong đó bắt đầu từ mình.', 'chatroom', 'khai'),
        line('khai_1_03', 'Bạn cùng lớp', 'dialogue', 'Khải chất đấy. Đang viral trong lớp!', 'chatroom'),
        line('khai_1_04', 'Khải', 'dialogue', 'Có mười hai giây thôi mà…', 'chatroom', 'khai'),
      ],
    },
    {
      id: 'khai_2', role: 'khai', kind: 'decision', title: 'Mai bắt chuyện', location: 'Lớp học · Thứ Hai', background: 'classroom', nextSceneId: 'khai_3', choices: choices(1),
      lines: [
        line('khai_2_01', 'Mai', 'dialogue', 'Khải, An không ổn. Chuyện hôm đó không giống điều cậu đang kể.', 'classroom', 'mai'),
        line('khai_2_02', 'Khải', 'dialogue', 'Cậu cũng thấy mọi người cười mà.', 'classroom', 'khai'),
        line('khai_2_03', 'Mai', 'dialogue', 'Có người cười không có nghĩa người bị trêu thấy vui.', 'classroom', 'mai'),
        line('khai_2_04', 'Khải', 'thought', 'Tớ muốn cô ấy nói An đã lấy công lao của mình. Nhưng Mai đang hỏi về một chuyện khác.', 'classroom', 'khai'),
      ],
    },
    {
      id: 'khai_3', role: 'khai', kind: 'decision', title: 'Trước buổi trao đổi', location: 'Phòng học · Trước buổi trao đổi', background: 'classroom', nextSceneId: 'khai_4', choices: choices(2),
      lines: [
        line('khai_3_01', 'Người kể chuyện', 'narration', 'Phòng học trống và chiếc poster cũ.', 'classroom'),
        line('khai_3_02', 'Khải', 'thought', 'Tớ giận chuyện cũ đến mức biến nó thành lý do cho chuyện mới.', 'classroom', 'khai'),
        line('khai_3_03', 'Cô Hương', 'dialogue', 'Cô sẽ kiểm tra bằng chứng và nghe từng người. Nhưng lời nói xúc phạm không phải là chuyện có thể bỏ qua.', 'classroom'),
        line('khai_3_04', 'Khải', 'dialogue', 'Nếu nói ra chuyện cũ, liệu mọi người có hiểu cho mình?', 'classroom', 'khai'),
      ],
    },
    {
      id: 'khai_4', role: 'khai', kind: 'decision', title: 'Điều phải làm sau lời xin lỗi', location: 'Trước buổi trao đổi', background: 'teacherroom', nextSceneId: 'khai_reveal', choices: choices(3),
      lines: [
        line('khai_4_01', 'Mai', 'dialogue', 'Tớ là người đầu tiên gửi đoạn cắt vào nhóm. Tớ sẽ nhận lỗi với An và đề nghị mọi người ngừng chuyển tiếp.', 'teacherroom', 'mai'),
        line('khai_4_02', 'Khải', 'dialogue', 'Nếu tớ xin lỗi, An có tha thứ không?', 'teacherroom', 'khai'),
        line('khai_4_03', 'Cô Hương', 'dialogue', 'Em không thể yêu cầu điều đó. Điều em có thể làm là ngừng gây hại và hợp tác khắc phục.', 'teacherroom'),
        line('khai_4_04', 'Khải', 'thought', 'Có lẽ điều khó nhất không phải là nói mình sai. Mà là làm điều đúng ngay cả khi chẳng ai lập tức tha thứ.', 'teacherroom', 'khai'),
      ],
    },
    {
      id: 'khai_reveal', role: 'khai', kind: 'reveal', title: 'Ngoài khung hình', location: 'Biên bản trao đổi · Thứ Ba', background: 'teacherroom', nextSceneId: 'khai_ending',
      lines: [
        line('khai_reveal_01', 'Hồ sơ buổi làm việc', 'narration', 'An không buộc phải có mặt trực tiếp.', 'teacherroom'),
        line('khai_reveal_02', 'Cô Hương', 'dialogue', 'Đây là bản ghi gốc, hai mươi chín giây. Đoạn được lan truyền chỉ có mười hai giây.', 'teacherroom', undefined, { title: 'Đối chiếu bản ghi', detail: '12 giây cắt / 29 giây gốc', progress: 12 / 29 }),
        line('khai_reveal_03', 'An (bản ghi)', 'dialogue', 'Dừng lại. Mình không thấy chuyện này buồn cười.', 'teacherroom'),
        line('khai_reveal_04', 'Khải', 'thought', 'Tớ đã nghe câu đó khi đứng ở hành lang. Tớ chọn làm như không nghe thấy.', 'teacherroom'),
        line('khai_reveal_05', 'Mai', 'dialogue', 'Em là người gửi đoạn cắt vào nhóm. Em nghĩ mình đang giúp.', 'teacherroom'),
        line('khai_reveal_06', 'Mai', 'dialogue', 'Nhưng em không có quyền tự ý đăng hình ảnh An.', 'teacherroom'),
        line('khai_reveal_07', 'Cô Hương', 'dialogue', 'Còn poster giải năm ngoái, hồ sơ gốc ghi rõ cả An và Khải.', 'teacherroom'),
        line('khai_reveal_08', 'Hồ sơ phim cũ', 'narration', 'Poster một tên; hồ sơ hai tên.', 'teacherroom', undefined, { title: 'Ngoài khung hình', detail: 'Poster: An · Hồ sơ: An & Khải' }),
        line('khai_reveal_09', 'Khải', 'dialogue', 'Em cứ tưởng… An đã cố ý bỏ tên em.', 'teacherroom'),
        line('khai_reveal_10', 'Cô Hương', 'dialogue', 'Thông tin bị truyền đạt thiếu là sai sót cần sửa. Nhưng chuyện đó không cho phép ai hạ nhục người khác.', 'teacherroom'),
        line('khai_reveal_11', 'Khải', 'thought', 'Dòng chữ quen thuộc trên kịch bản hiện ra.', 'teacherroom'),
        line('khai_reveal_12', 'Khải', 'thought', "Chính tớ viết: 'Một đoạn video không thể kể hết câu chuyện của một con người.'", 'teacherroom', undefined, { title: 'Thông điệp Khải từng viết', detail: 'Một đoạn video không thể kể hết câu chuyện của một con người.' }),
        line('khai_reveal_13', 'Khải', 'thought', 'Một câu nói từng là thành tích. Hôm nay là câu hỏi tớ phải trả lời bằng hành động.', 'teacherroom'),
      ],
    },
    {
      id: 'khai_ending', role: 'khai', kind: 'ending', title: 'Kết thúc', location: '', background: 'classroom',
      lines: [line('khai_ending_01', 'Thông điệp', 'narration', 'Một đoạn video không thể kể hết câu chuyện của một con người.', 'classroom')],
    },
  ],
}
