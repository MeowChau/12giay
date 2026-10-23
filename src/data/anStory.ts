import { decisions } from './decisions'
import type { BackgroundId, EndingType, NarrativeChoice, NarrativeStory, PortraitId, StoryEvidence, StoryLine } from '../types/narrative'

// Canonical An dialogue from docs/STORY_SCRIPT.md. Split boxes preserve reading order.
function line(id: string, speaker: string, type: StoryLine['type'], text: string, background: BackgroundId, portrait?: PortraitId, evidence?: StoryEvidence): StoryLine {
  return { id, speaker, type, text, background, portrait, evidence }
}

const responses: readonly (readonly (readonly StoryLine[])[])[] = [
  [
    [
      line('an_1_A_1', 'An', 'thought', 'Mình giữ lại những gì đang xảy ra. Rồi đặt điện thoại xuống.', 'chatroom', 'an'),
      line('an_1_A_2', 'An', 'thought', 'Việc cần giải quyết sẽ không biến mất, nhưng mình cần được thở.', 'chatroom', 'an'),
    ],
    [line('an_1_B_1', 'An', 'thought', "Mình viết 'Đừng tiếp tục chia sẻ video này.' Một dấu ba chấm hiện lên rồi biến mất.", 'chatroom', 'an')],
    [line('an_1_C_1', 'An', 'thought', 'Mình tắt màn hình. Không phải vì chuyện này nhỏ đi, mà vì mình chưa thể đọc thêm.', 'chatroom', 'an')],
  ],
  [
    [line('an_2_A_1', 'An', 'thought', "Mình nhắn cô Hương: 'Cô có thể dành cho em một cuộc nói chuyện riêng không ạ?'", 'classroom', 'an')],
    [line('an_2_B_1', 'Người kể chuyện', 'narration', 'Mai lặng im. Lần đầu tiên cô ấy không chen vào bằng lời an ủi vội vàng.', 'classroom', 'mai')],
    [
      line('an_2_C_1', 'An', 'thought', "Mình nói 'Cho tớ ít thời gian.' Mai gật đầu.", 'classroom', 'an'),
      line('an_2_C_2', 'An', 'thought', 'Một lời từ chối cũng cần được tôn trọng.', 'classroom', 'an'),
    ],
  ],
  [
    [line('an_3_A_1', 'Người kể chuyện', 'narration', 'Mai đồng ý dừng chia sẻ, báo cáo các bản đăng lại và chỉ giữ bản gốc để trình bày với người có trách nhiệm.', 'classroom', 'mai')],
    [line('an_3_B_1', 'Mai', 'dialogue', 'Tớ sẽ đi cùng, Mai nói. Tớ sẽ không nói thay cậu nếu cậu không muốn.', 'classroom', 'mai')],
    [
      line('an_3_C_1', 'Người kể chuyện', 'narration', 'Mai lùi lại.', 'classroom', 'mai'),
      line('an_3_C_2', 'Mai', 'dialogue', 'Tớ hiểu. Tớ sẽ tìm cách ngăn video lan thêm và không ép cậu trả lời.', 'classroom', 'mai'),
    ],
  ],
  [
    [line('an_4_A_1', 'Người kể chuyện', 'narration', 'Cô Hương ghi rõ các bước: ngừng phát tán, bảo vệ An khỏi trả đũa, theo dõi trong lớp và liên hệ gia đình khi phù hợp.', 'hallway')],
    [line('an_4_B_1', 'An', 'thought', 'Mình viết bằng những câu ngắn. Không phải vì ít đau hơn, mà vì cuối cùng có người đọc mà không cười.', 'hallway', 'an')],
    [line('an_4_C_1', 'Cô Hương', 'dialogue', 'Em có thể trao đổi khi sẵn sàng. Cô vẫn cần thực hiện trách nhiệm bảo vệ em ngay từ lúc này.', 'hallway')],
  ],
]

function choices(index: number): readonly NarrativeChoice[] {
  return decisions.an[index].map((choice, option) => ({ ...choice, response: responses[index][option] }))
}

export const anEndings: Record<EndingType, string> = {
  positive: 'Cô Hương đã hướng dẫn việc ngừng lan truyền, liên hệ những người liên quan và xây dựng kế hoạch để An trở lại lớp an toàn hơn. An vẫn còn lo lắng, và điều đó không làm cô yếu đuối. Cô có người đồng hành; các bước hỗ trợ được tiếp tục, không phụ thuộc vào việc An có tha thứ hay không.',
  unresolved: 'Một số người đã lắng nghe, nhưng các bước bảo vệ chưa đồng bộ. An không có nghĩa vụ phải tự mình giải quyết; người lớn và nhà trường vẫn phải hành động. Câu chuyện chưa khép lại, và sự hỗ trợ vẫn có thể bắt đầu ngay hôm nay.',
  negative: 'Những lời bình luận tiếp tục xuất hiện vì người phát tán và những người có trách nhiệm chưa ngăn được chúng. Đây không phải lỗi của An, bất kể cô đã sẵn sàng lên tiếng hay chưa. An vẫn xứng đáng được bảo vệ và hỗ trợ.',
}

export const anStory: NarrativeStory = {
  role: 'an',
  scenes: [
    {
      id: 'an_intro', role: 'an', kind: 'intro', title: 'Tiếng cười', location: 'Hành lang · Thứ Sáu, 10:12', background: 'hallway', nextSceneId: 'an_1',
      lines: [
        line('an_intro_01', 'An', 'thought', 'Tập bài rơi xuống. Mình cúi nhặt.', 'hallway', 'an'),
        line('an_intro_02', 'An', 'thought', 'Phía sau có tiếng ai đó cười.', 'hallway', 'an'),
        line('an_intro_03', 'Khải', 'dialogue', 'Chậm thôi, lớp trưởng. Có mỗi mấy tờ giấy mà cũng thành tiết mục được à?', 'hallway', 'khai'),
        line('an_intro_04', 'An', 'dialogue', 'Khải, đừng nói thế.', 'hallway', 'an'),
        line('an_intro_05', 'Khải', 'dialogue', 'Đùa thôi. Mọi người cười mà.', 'hallway', 'khai'),
        line('an_intro_06', 'An', 'thought', 'Mình từng nghĩ tiếng cười của bạn bè là thứ khiến lớp học bớt mệt. Hôm nay, nó giống một cánh cửa đóng lại.', 'hallway', 'an'),
        line('an_intro_07', 'An', 'dialogue', 'Dừng lại. Mình không thấy chuyện này buồn cười.', 'hallway', 'an'),
        line('an_intro_08', 'Khung hình', 'narration', '00:12', 'hallway', undefined, { title: 'Khung hình dừng lại', detail: '00:12' }),
        line('an_intro_09', 'An', 'thought', 'Mình đã nói. Nhưng trong đoạn video đang chạy trên điện thoại mọi người, câu ấy không tồn tại.', 'hallway', 'an'),
      ],
    },
    {
      id: 'an_1', role: 'an', kind: 'decision', title: 'Thông báo trong nhóm lớp', location: 'Nhóm lớp · Thứ Sáu, 10:18', background: 'chatroom', nextSceneId: 'an_2', choices: choices(0),
      lines: [
        line('an_1_01', 'Tin nhắn nhóm lớp', 'dialogue', 'Lớp trưởng diễn hài đỉnh thế =)))', 'chatroom'),
        line('an_1_02', 'Tin nhắn nhóm lớp', 'dialogue', 'Ai gửi tiếp cho nhóm bên kia chưa?', 'chatroom'),
        line('an_1_03', 'An', 'thought', 'Ngoài cửa sổ trời vẫn sáng. Trong điện thoại của mình, mỗi dòng chữ làm căn phòng nhỏ đi.', 'chatroom', 'an'),
        line('an_1_04', 'An', 'dialogue', 'Mình có thể làm gì ngay bây giờ?', 'chatroom', 'an'),
      ],
    },
    {
      id: 'an_2', role: 'an', kind: 'decision', title: 'Chiếc bàn cạnh cửa sổ', location: 'Lớp học · Thứ Hai', background: 'classroom', nextSceneId: 'an_3', choices: choices(1),
      lines: [
        line('an_2_01', 'Người kể chuyện', 'narration', 'Lớp trống, chiếc ghế bên cạnh An còn trống.', 'classroom'),
        line('an_2_02', 'An', 'thought', 'Lớp vẫn đông. Nhưng nhiều cuộc nói chuyện dừng lại khi mình bước tới.', 'classroom', 'an'),
        line('an_2_03', 'Mai', 'dialogue', 'An… tớ muốn hỏi cậu có ổn không.', 'classroom', 'mai'),
        line('an_2_04', 'An', 'dialogue', 'Câu ấy khó trả lời hơn cậu nghĩ.', 'classroom', 'an'),
        line('an_2_05', 'Mai', 'dialogue', 'Tớ có thể nghe. Hoặc nếu cậu muốn, mình tìm người giúp.', 'classroom', 'mai'),
        line('an_2_06', 'An', 'thought', 'Mình quen tự giải quyết vấn đề. Nhưng chuyện này không phải bài kiểm tra để một mình tìm đáp án.', 'classroom', 'an'),
      ],
    },
    {
      id: 'an_3', role: 'an', kind: 'decision', title: 'Người quay video', location: 'Lớp học · Thứ Hai', background: 'classroom', nextSceneId: 'an_4', choices: choices(2),
      lines: [
        line('an_3_01', 'Mai', 'dialogue', 'An, có chuyện này tớ phải nói. Tớ là người đã quay video.', 'classroom', 'mai'),
        line('an_3_02', 'An', 'dialogue', 'Và gửi nó?', 'classroom', 'an'),
        line('an_3_03', 'Mai', 'dialogue', 'Tớ muốn mọi người nhìn thấy Khải đang làm gì.', 'classroom', 'mai'),
        line('an_3_04', 'Mai', 'dialogue', 'Tớ cắt một đoạn rồi đăng vào nhóm. Tớ nghĩ như thế họ sẽ can ngăn.', 'classroom', 'mai'),
        line('an_3_05', 'An', 'dialogue', 'Cậu chưa hỏi tớ. Cậu biến một ngày tồi tệ của tớ thành thứ mọi người có thể chuyển tiếp.', 'classroom', 'an'),
        line('an_3_06', 'Mai', 'dialogue', 'Tớ biết. Tớ không định làm tổn thương cậu, nhưng tớ đã làm.', 'classroom', 'mai'),
        line('an_3_07', 'Mai', 'dialogue', 'Tớ sẽ chịu trách nhiệm.', 'classroom', 'mai'),
        line('an_3_08', 'An', 'thought', 'Mình muốn nổi giận. Mình cũng mệt.', 'classroom', 'an'),
        line('an_3_09', 'An', 'thought', 'Hai cảm giác ấy có thể cùng tồn tại.', 'classroom', 'an'),
      ],
    },
    {
      id: 'an_4', role: 'an', kind: 'decision', title: 'Trước phòng giáo viên', location: 'Trước phòng giáo viên', background: 'hallway', nextSceneId: 'an_reveal', choices: choices(3),
      lines: [
        line('an_4_01', 'Người kể chuyện', 'narration', 'Hành lang yên, cánh cửa hé sáng.', 'hallway'),
        line('an_4_02', 'Cô Hương', 'dialogue', 'An, cô đã biết sơ bộ sự việc. Em có quyền chọn cách cung cấp thông tin an toàn.', 'hallway'),
        line('an_4_03', 'Cô Hương', 'dialogue', 'Cô sẽ làm việc riêng với từng người nếu cần.', 'hallway'),
        line('an_4_04', 'An', 'thought', 'Mình không cần chứng minh rằng mình đủ mạnh để chịu đựng. Mình cần được bảo vệ.', 'hallway', 'an'),
      ],
    },
    {
      id: 'an_reveal', role: 'an', kind: 'reveal', title: 'Sự thật ngoài khung hình', location: 'Biên bản trao đổi · Thứ Ba', background: 'teacherroom', nextSceneId: 'an_ending',
      lines: [
        line('an_reveal_01', 'Góc nhìn của An', 'narration', 'An có thể quan sát từ góc nhìn riêng hoặc qua biên bản; không ép chạm mặt.', 'teacherroom'),
        line('an_reveal_02', 'Cô Hương', 'dialogue', 'Cô đã xem bản gốc.', 'teacherroom'),
        line('an_reveal_03', 'Cô Hương', 'dialogue', 'Video được gửi trong lớp dài mười hai giây. Bản Mai quay dài hai mươi chín giây.', 'teacherroom'),
        line('an_reveal_04', 'Dòng thời gian', 'narration', '00:12 → 00:29', 'teacherroom', undefined, { title: 'Đối chiếu bản ghi', detail: '12 giây cắt / 29 giây gốc', progress: 12 / 29 }),
        line('an_reveal_05', 'Dòng chữ bị cắt', 'dialogue', 'Dừng lại. Mình không thấy chuyện này buồn cười.', 'teacherroom'),
        line('an_reveal_06', 'An', 'thought', 'Mình đã nói. Giọng mình vẫn ở đó.', 'teacherroom'),
        line('an_reveal_07', 'An', 'thought', 'Chỉ là không nằm trong phần mọi người chọn xem.', 'teacherroom'),
        line('an_reveal_08', 'Mai', 'dialogue', 'Em đã tự ý cắt và gửi đoạn ngắn. Em nghĩ sẽ giúp, nhưng em đã không hỏi An.', 'teacherroom'),
        line('an_reveal_09', 'Mai', 'dialogue', 'Em xin chịu trách nhiệm và sẽ hỗ trợ xử lý việc phát tán.', 'teacherroom'),
        line('an_reveal_10', 'Cô Hương', 'dialogue', 'Còn một việc khác. Khải, em có nói về bộ phim ngắn năm ngoái.', 'teacherroom'),
        line('an_reveal_11', 'Hồ sơ phim cũ', 'narration', 'Poster phim cũ: ảnh An; sau đó hồ sơ gốc hiển thị 2 tên.', 'teacherroom', undefined, { title: 'Ngoài khung hình', detail: 'Poster: An · Hồ sơ: An & Khải' }),
        line('an_reveal_12', 'Cô Hương', 'dialogue', 'Hồ sơ dự thi ghi rõ An viết kịch bản, Khải dựng phim.', 'teacherroom'),
        line('an_reveal_13', 'Cô Hương', 'dialogue', 'Poster chỉ ghi tên An vì bạn ấy đại diện thuyết trình. Thầy cô đã truyền đạt thông tin không đầy đủ.', 'teacherroom'),
        line('an_reveal_14', 'An', 'thought', 'Mình không biết Khải đã mang theo hiểu lầm đó suốt tám tháng.', 'teacherroom'),
        line('an_reveal_15', 'Khải', 'dialogue', 'Tớ đã nghĩ cậu cố tình xóa tên tớ.', 'teacherroom'),
        line('an_reveal_16', 'An', 'dialogue', 'Cậu có thể hỏi tớ. Nhưng kể cả khi cậu giận, điều cậu đã làm vẫn không đúng.', 'teacherroom'),
        line('an_reveal_17', 'Cô Hương', 'dialogue', 'Hiểu điều đã xảy ra không có nghĩa là xóa trách nhiệm của người đã gây tổn thương.', 'teacherroom'),
        line('an_reveal_18', 'Thông điệp phim cũ', 'narration', 'Một đoạn video không thể kể hết câu chuyện của một con người.', 'teacherroom', undefined, { title: 'Dòng chữ do Khải viết', detail: 'Một đoạn video không thể kể hết câu chuyện của một con người.' }),
        line('an_reveal_19', 'An', 'thought', 'Điều chúng mình từng viết để nhắc người khác, rốt cuộc lại là điều cả lớp cần học lại.', 'teacherroom'),
      ],
    },
    {
      id: 'an_ending', role: 'an', kind: 'ending', title: 'Kết thúc', location: '', background: 'classroom',
      lines: [line('an_ending_01', 'Thông điệp', 'narration', 'Một đoạn video không thể kể hết câu chuyện của một con người.', 'classroom')],
    },
  ],
}
