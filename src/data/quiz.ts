import type { QuizQuestion } from '../types/quiz'

// Exact static content from docs/QUIZ.md. No runtime generation or answer changes.
export const quizQuestions: readonly QuizQuestion[] = [
  {
    "id": "Q01",
    "title": "Trò đùa và ranh giới",
    "question": "Trong giờ ra chơi, cả nhóm cười khi một bạn bị chế giễu, nhưng bạn đó đã nói rõ “Dừng lại”. Điều gì là phù hợp nhất?",
    "options": [
      {
        "id": "A",
        "text": "Cứ tiếp tục vì đa số đang cười."
      },
      {
        "id": "B",
        "text": "Ngừng hành vi và tôn trọng lời đề nghị của bạn đó."
      },
      {
        "id": "C",
        "text": "Chờ cho giáo viên nhắc mới dừng."
      },
      {
        "id": "D",
        "text": "Bảo bạn đó nên học cách chịu đựng."
      }
    ],
    "correctAnswer": "B",
    "explanation": "Phản ứng của đám đông không thay thế sự đồng thuận; khi người bị nhắm tới không thoải mái và yêu cầu dừng, cần tôn trọng ranh giới của họ."
  },
  {
    "id": "Q02",
    "title": "Hỗ trợ khi bị bắt nạt",
    "question": "Một học sinh thường xuyên nhận bình luận xúc phạm trong nhóm lớp. Bước nào có thể giúp tìm hỗ trợ an toàn?",
    "options": [
      {
        "id": "A",
        "text": "Tìm giáo viên, người chăm sóc hoặc một người lớn đáng tin cậy để trao đổi."
      },
      {
        "id": "B",
        "text": "Chịu đựng một mình đến khi mọi người quên."
      },
      {
        "id": "C",
        "text": "Tự hẹn gặp nhóm gây hại để đối đầu một mình."
      },
      {
        "id": "D",
        "text": "Gửi lại lời xúc phạm tới thật nhiều người khác."
      }
    ],
    "correctAnswer": "A",
    "explanation": "Người bị bắt nạt có quyền được người lớn đáng tin cậy hỗ trợ; không phải tự mình gánh trách nhiệm giải quyết."
  },
  {
    "id": "Q03",
    "title": "Lưu bằng chứng",
    "question": "Nếu một bài đăng bắt nạt vẫn còn hiển thị và bạn đang ở nơi an toàn, cách xử lý bằng chứng nào phù hợp?",
    "options": [
      {
        "id": "A",
        "text": "Chỉnh sửa ảnh chụp để khiến bài đăng nghiêm trọng hơn."
      },
      {
        "id": "B",
        "text": "Chuyển tiếp bài đăng cho nhiều nhóm để mọi người biết."
      },
      {
        "id": "C",
        "text": "Lưu bản chụp có ngữ cảnh, thời gian khi có thể, và chia sẻ với người hỗ trợ phù hợp."
      },
      {
        "id": "D",
        "text": "Xóa toàn bộ tin nhắn liên quan rồi không kể với ai."
      }
    ],
    "correctAnswer": "C",
    "explanation": "Bằng chứng nguyên vẹn có thể hữu ích cho việc báo cáo; việc phát tán thêm có thể khiến tổn thương lan rộng."
  },
  {
    "id": "Q04",
    "title": "Vai trò người chứng kiến",
    "question": "Bạn chứng kiến một người bị chế giễu giữa nhóm đông. Cách can thiệp an toàn hơn là gì?",
    "options": [
      {
        "id": "A",
        "text": "Quay clip để đăng công khai cảnh cáo người gây hại."
      },
      {
        "id": "B",
        "text": "Lặng lẽ thả biểu tượng cười để tránh bị chú ý."
      },
      {
        "id": "C",
        "text": "Ép người bị hại phải đối chất ngay tại chỗ."
      },
      {
        "id": "D",
        "text": "Hỏi riêng người bị hại cần gì và nhờ người lớn hỗ trợ nếu cần."
      }
    ],
    "correctAnswer": "D",
    "explanation": "Người chứng kiến có thể giúp đỡ bằng cách lắng nghe và tìm hỗ trợ phù hợp, không tự ý phát tán hình ảnh."
  },
  {
    "id": "Q05",
    "title": "Video đã bị phát tán",
    "question": "Sau khi video gây tổn thương được chia sẻ trong nhóm chat, hành động nào giảm nguy cơ gây hại thêm?",
    "options": [
      {
        "id": "A",
        "text": "Chia sẻ lại kèm lời bình luận bảo vệ nạn nhân."
      },
      {
        "id": "B",
        "text": "Ngừng chuyển tiếp, báo cáo nội dung và đề nghị gỡ khỏi nơi đăng khi phù hợp."
      },
      {
        "id": "C",
        "text": "Lưu làm meme vì sự việc đã công khai."
      },
      {
        "id": "D",
        "text": "Yêu cầu nạn nhân tự đi nhắn tin với từng người để xin xóa."
      }
    ],
    "correctAnswer": "B",
    "explanation": "Hạn chế phát tán và dùng kênh báo cáo giúp giảm khả năng video tiếp tục làm tổn thương người trong đó."
  },
  {
    "id": "Q06",
    "title": "Ý định và hậu quả",
    "question": "Mai đăng video vì muốn người khác lên tiếng phản đối bắt nạt nhưng chưa hỏi ý kiến An. Nhận định nào phù hợp nhất?",
    "options": [
      {
        "id": "A",
        "text": "Có ý tốt thì chắc chắn hành động không gây hại."
      },
      {
        "id": "B",
        "text": "Chỉ người quay video chịu trách nhiệm, người chuyển tiếp không liên quan."
      },
      {
        "id": "C",
        "text": "Ý định có thể tốt nhưng vẫn cần nhận lỗi vì đăng khi chưa có sự đồng ý."
      },
      {
        "id": "D",
        "text": "An phải biết ơn vì đã được nhiều người chú ý."
      }
    ],
    "correctAnswer": "C",
    "explanation": "Ý định và tác động là hai điều khác nhau; sự đồng thuận và quyền riêng tư vẫn quan trọng."
  },
  {
    "id": "Q07",
    "title": "Mâu thuẫn cũ",
    "question": "Khải nghĩ An từng lấy mất công lao dự án. Điều gì đúng nhất trong cách xử lý mâu thuẫn này?",
    "options": [
      {
        "id": "A",
        "text": "Tìm hiểu sự thật, trao đổi tôn trọng và không lấy bất mãn làm lý do bắt nạt."
      },
      {
        "id": "B",
        "text": "Chế giễu trước lớp để An hiểu cảm giác bị tổn thương."
      },
      {
        "id": "C",
        "text": "Đăng đoạn clip về An như cách 'đòi công bằng'."
      },
      {
        "id": "D",
        "text": "Lôi kéo nhóm bạn tẩy chay An cho đến khi An xin lỗi."
      }
    ],
    "correctAnswer": "A",
    "explanation": "Mâu thuẫn hoặc hiểu lầm không biện minh cho hành vi hạ nhục hay bắt nạt."
  },
  {
    "id": "Q08",
    "title": "Lời xin lỗi",
    "question": "Người gây bạo lực đã xin lỗi nhưng người bị hại chưa muốn tiếp xúc. Điều gì cần được tôn trọng?",
    "options": [
      {
        "id": "A",
        "text": "Buộc người bị hại tha thứ để cả lớp hòa thuận."
      },
      {
        "id": "B",
        "text": "Đăng lời xin lỗi công khai kèm tên và ảnh người bị hại dù chưa xin phép."
      },
      {
        "id": "C",
        "text": "Cho rằng đã xin lỗi thì không cần làm gì tiếp."
      },
      {
        "id": "D",
        "text": "Tôn trọng khoảng cách, ngừng gây hại và tiếp tục thực hiện trách nhiệm khắc phục."
      }
    ],
    "correctAnswer": "D",
    "explanation": "Không ai có nghĩa vụ phải tha thứ; trách nhiệm không kết thúc ở lời xin lỗi."
  },
  {
    "id": "Q09",
    "title": "Trách nhiệm của nạn nhân",
    "question": "Nếu một học sinh chưa sẵn sàng kể ngay việc mình bị bắt nạt, nhận định nào đúng?",
    "options": [
      {
        "id": "A",
        "text": "Học sinh đó khiến tình hình tệ đi và phải tự chịu trách nhiệm."
      },
      {
        "id": "B",
        "text": "Học sinh vẫn xứng đáng được bảo vệ; người gây hại và người có trách nhiệm phải ngăn bạo lực."
      },
      {
        "id": "C",
        "text": "Giáo viên không cần can thiệp vì học sinh chưa trình bày mọi chi tiết."
      },
      {
        "id": "D",
        "text": "Người chứng kiến nên gây áp lực để học sinh kể hết trước lớp."
      }
    ],
    "correctAnswer": "B",
    "explanation": "Người bị bắt nạt không phải chịu trách nhiệm về hành vi của người gây hại, bất kể họ có sẵn sàng lên tiếng chưa."
  },
  {
    "id": "Q10",
    "title": "Nhà trường và bạn bè",
    "question": "Cách xử lý lâu dài nào hỗ trợ xây dựng môi trường lớp an toàn hơn?",
    "options": [
      {
        "id": "A",
        "text": "Chỉ yêu cầu đôi bên bắt tay hòa giải rồi xem như kết thúc."
      },
      {
        "id": "B",
        "text": "Tránh nhắc tới chuyện bắt nạt dù video vẫn tiếp tục lan truyền."
      },
      {
        "id": "C",
        "text": "Xác minh thông tin, ngăn hành vi, bảo vệ người bị hại, theo dõi và hỗ trợ các bên phù hợp."
      },
      {
        "id": "D",
        "text": "Phát lại clip trong giờ sinh hoạt để cả lớp cùng phán xét."
      }
    ],
    "correctAnswer": "C",
    "explanation": "Can thiệp cần bảo vệ an toàn, xử lý hành vi và theo dõi tiếp; không ép đối mặt hay tha thứ."
  }
]
