// Lịch mặc định cho một lập trình viên .NET đã đi làm lâu năm, muốn tăng tốc:
// - Giờ làm 8:00–17:00 (T2–T6) chỉ dành cho công ty, đi làm bằng xe máy, về nhà 18:00
// - Ngủ đủ 8 tiếng: tối CN–T5 21:30–05:30, tối T6–T7 22:30–06:30
// - Ưu tiên số 1: tiếng Anh từ A1 lên C1 (~10,5 giờ/tuần). Sau đó: .NET, AI engineering, kiếm thêm,
//   thể lực, đọc sách. Có giờ ăn, giải lao và giải trí rõ ràng.
const WEEKDAYS = [1, 2, 3, 4, 5]
const WEEKEND = [0, 6]
const MON_THU = [1, 2, 3, 4]

// Tăng số này khi đổi lịch mặc định: máy người dùng sẽ được cập nhật lịch mới,
// các việc lặp lại do người dùng tự thêm vẫn giữ nguyên
export const SCHEDULE_VERSION = 8

// Việc từng có trong lịch mặc định nhưng đã bỏ
export const RETIRED_ROUTINE_IDS = [
  'wd-english-listen', 'wd-tech-news', 'daily-vocab', 'wd-income', 'wd-exercise', 'wd-english', 'wd-code',
  'wd-listening', 'wd-reading', 'wd-sleep', 'we-exercise', 'sat-income', 'we-sleep', 'we-vocab',
  'am-en-mon', 'am-en-tue', 'am-en-wed', 'am-en-thu', 'am-en-fri',
]

const routine = (id, fields) => ({ id, note: '', important: false, ...fields })

export const DEFAULT_ROUTINES = [
  // ================= BUỔI SÁNG NGÀY THƯỜNG (05:30 – 07:00) =================
  routine('am-strength', {
    title: 'Tập sức mạnh',
    time: '05:35',
    duration: 30,
    category: 'health',
    days: [1, 3, 5],
    note:
      'Khởi động 5 phút. 4 vòng: 15 hít đất, 20 squat, 12 lunge mỗi chân, 10 hít đất kim cương, plank 45 giây. Nghỉ 60 giây giữa các vòng. ' +
      'Mỗi tuần tăng khoảng 10% số lần. Ghi lại số lần vào ghi chú để biết mình tiến bộ.',
  }),
  routine('am-cardio', {
    title: 'Tập cardio',
    time: '05:35',
    duration: 30,
    category: 'health',
    days: [2, 4],
    note: 'Chạy bộ 20 phút, hoặc HIIT 20 phút (30 giây hết sức, 30 giây nghỉ). Giãn cơ 5 phút cuối buổi.',
  }),
  routine('am-en', {
    title: 'Tiếng Anh: ngữ pháp và phát âm',
    time: '06:10',
    duration: 30,
    category: 'study',
    important: true,
    days: WEEKDAYS,
    note:
      'Buổi sáng đầu óc tỉnh nhất nên dành để học kiến thức MỚI. ' +
      'Tháng đầu: 10 phút học phát âm theo bảng IPA, mỗi ngày 2–3 âm, ghi âm giọng mình rồi so với bản chuẩn. ' +
      'Còn lại: học 1 bài trong sách Essential Grammar in Use (sách đỏ, Raymond Murphy, dành cho A1–A2) và làm hết bài tập. ' +
      'Chỗ nào không hiểu, nhờ Claude giải thích bằng tiếng Việt và cho thêm 10 câu luyện. ' +
      'Học xong sách đỏ (khoảng 6 tháng) thì chuyển sang English Grammar in Use (sách xanh, B1–B2).',
  }),
  routine('am-breakfast', {
    title: 'Ăn sáng, chuẩn bị đi làm',
    time: '06:40',
    duration: 20,
    category: 'life',
    days: WEEKDAYS,
    note: 'Ăn đủ chất đạm (trứng, sữa, bánh mì) để không đói giữa buổi sáng.',
  }),

  // ================= BUỔI TỐI NGÀY THƯỜNG (18:00 – 21:30) =================
  routine('pm-dinner', {
    title: 'Tắm, ăn tối, nghỉ ngơi',
    time: '18:00',
    duration: 60,
    category: 'life',
    days: WEEKDAYS,
    note: 'Một tiếng trọn vẹn để xả mệt sau giờ làm: tắm, ăn tối với gia đình, trò chuyện. Chưa đụng vào máy tính.',
  }),
  routine('pm-dotnet-mon', {
    title: '.NET chuyên sâu',
    time: '19:00',
    duration: 60,
    category: 'work',
    important: true,
    days: [1, 3],
    note:
      'Mỗi chủ đề học trong 2–3 tuần, mỗi buổi phải ra code chạy được và push lên GitHub. ' +
      '1) Performance: Span<T>, ArrayPool, BenchmarkDotNet, đo allocation bằng dotnet-counters/dotnet-trace. ' +
      '2) Async bên trong: ValueTask, Channels, IAsyncEnumerable, cancellation, ThreadPool starvation. ' +
      '3) EF Core nâng cao: compiled query, split query, ExecuteUpdate/Delete, interceptor, concurrency. ' +
      '4) ASP.NET Core: middleware pipeline, rate limiting, output cache, OpenTelemetry. ' +
      '5) Kiến trúc: modular monolith, vertical slice, outbox pattern, .NET Aspire. ' +
      '6) Testing: Testcontainers, WebApplicationFactory, snapshot test, mutation test với Stryker. ' +
      'Cách học: tự viết trước, rồi mới dùng Claude Code để review và so sánh với cách làm của mình.',
  }),
  routine('pm-ai-tue', {
    title: 'AI engineering với .NET',
    time: '19:00',
    duration: 60,
    category: 'work',
    important: true,
    days: [2],
    note:
      'Học cách xây sản phẩm có AI, không chỉ dùng AI để viết code. Mỗi chủ đề khoảng 2–3 tuần. ' +
      '1) Gọi Claude API từ C#: messages, streaming, prompt caching, tính chi phí theo token. ' +
      '2) Tool use: cho LLM gọi API nội bộ của bạn. ' +
      '3) RAG: embedding, vector store (pgvector hoặc Qdrant), cách chia nhỏ tài liệu (chunking), đánh giá chất lượng câu trả lời. ' +
      '4) Viết MCP server bằng C# để Claude dùng được tool riêng của bạn. ' +
      '5) Microsoft.Extensions.AI để không phụ thuộc vào một nhà cung cấp. ' +
      '6) Dùng Claude Code thành thạo: CLAUDE.md, slash command tự tạo, hook, subagent. ' +
      'Tài liệu tiếng Anh thì nhờ Claude dịch và giải thích – vừa học kỹ thuật vừa làm quen thuật ngữ.',
  }),
  routine('pm-project-thu', {
    title: 'Dự án kiếm thêm',
    time: '19:00',
    duration: 60,
    category: 'money',
    important: true,
    days: [4],
    note:
      'Làm tiếp dự án đang theo đuổi (sáng Thứ 7 làm khối lớn). Buổi tối nay làm những phần nhỏ, rõ ràng: sửa bug, viết trang giới thiệu, ' +
      'trả lời người dùng, nghiên cứu đối thủ. Quy tắc: cứ 4 tuần phải đưa ra được một thứ thật sự có người dùng hoặc có người trả tiền.',
  }),
  routine('pm-design-fri', {
    title: 'System design và viết bài chia sẻ',
    time: '19:00',
    duration: 60,
    category: 'work',
    days: [5],
    note:
      '30 phút: thiết kế một hệ thống quen thuộc (URL shortener, chat, thanh toán, hàng đợi thông báo) theo các bước: yêu cầu, ước lượng tải, API, dữ liệu, mở rộng, đánh đổi. Sau đó nhờ Claude phản biện. ' +
      '30 phút: viết bài chia sẻ những gì học trong tuần lên blog hoặc LinkedIn. Mỗi bài là một viên gạch xây thương hiệu cá nhân, ' +
      'về sau chính là kênh kiếm tiền (khóa học, tư vấn, affiliate).',
  }),
  routine('pm-break', {
    title: 'Giải lao',
    time: '20:00',
    duration: 10,
    category: 'life',
    days: MON_THU,
    note: 'Đứng dậy rời bàn, đi lại, uống nước, ăn chút hoa quả. Không lướt mạng xã hội để mắt và đầu được nghỉ thật.',
  }),
  routine('pm-english', {
    title: 'Tiếng Anh: từ vựng, nghe và nói',
    time: '20:10',
    duration: 45,
    category: 'study',
    important: true,
    days: MON_THU,
    note:
      '15 phút từ vựng: học 10 từ mới mỗi ngày trong danh sách Oxford 3000 (3000 từ thông dụng nhất) bằng Anki, kèm phát âm và một câu ví dụ. ' +
      '15 phút nghe: VOA Learning English (đọc chậm, có lời), nghe một bài 3 lần: lần 1 nghe hiểu ý, lần 2 nhìn lời, lần 3 nói nhại lại theo từng câu. ' +
      '15 phút nói: bật giọng nói của Claude, nói "Please talk to me at A1 level, use simple words, speak slowly", ' +
      'dùng ngữ pháp sáng nay vừa học để nói về bản thân, công việc, gia đình. Sai thoải mái, không sao cả.',
  }),
  routine('pm-reading', {
    title: 'Đọc sách',
    time: '20:55',
    duration: 30,
    category: 'personal',
    days: MON_THU,
    note:
      'Đọc sách giấy, tắt màn hình, vừa đọc vừa thả lỏng để dễ ngủ. Đọc xen kẽ sách nghề và sách về tiền (bản tiếng Việt): ' +
      'Thiết kế hệ thống dữ liệu chuyên sâu (Designing Data-Intensive Applications), Lập trình viên thực dụng (The Pragmatic Programmer), ' +
      'Tâm lý học về tiền (The Psychology of Money), Khởi nghiệp với 100 đô (The $100 Startup), Deep Work.',
  }),
  // Tối CN–T5 ngủ 21:30 vì sáng hôm sau phải dậy 05:30 đi làm
  routine('pm-review', {
    title: 'Tổng kết ngày và chuẩn bị ngủ',
    time: '21:25',
    duration: 5,
    category: 'health',
    important: true,
    days: [0, 1, 2, 3, 4],
    note: 'Tích nốt việc đã xong, liếc qua lịch ngày mai. Cất điện thoại xa giường. Ngủ lúc 21:30 để dậy 05:30.',
  }),

  // ================= TỐI THỨ 6 =================
  routine('fri-english', {
    title: 'Tiếng Anh: ôn nhẹ cuối tuần làm việc',
    time: '20:00',
    duration: 30,
    category: 'study',
    days: [5],
    note: 'Ôn Anki 15 phút, rồi nghe lại bài VOA hay nhất trong tuần một lần nữa. Nhẹ nhàng để còn đi chơi.',
  }),
  routine('fri-free', {
    title: 'Tối tự do',
    time: '20:30',
    duration: 105,
    category: 'life',
    days: [5],
    note: 'Phần thưởng sau một tuần: đi chơi, xem phim, chơi game, gặp bạn bè. Không học gì cả.',
  }),
  // Tối T6 và T7 được ngủ muộn hơn 1 tiếng vì sáng hôm sau dậy 06:30
  routine('late-sleep', {
    title: 'Tổng kết ngày và chuẩn bị ngủ',
    time: '22:15',
    duration: 15,
    category: 'health',
    important: true,
    days: [5, 6],
    note: 'Ngủ lúc 22:30 để dậy 06:30. Chỉ lệch 1 tiếng so với ngày thường để giữ nhịp ngủ.',
  }),

  // ================= CUỐI TUẦN =================
  routine('sat-exercise', {
    title: 'Chạy dài hoặc chơi thể thao',
    time: '06:45',
    duration: 60,
    category: 'health',
    days: [6],
    note: 'Mục tiêu: chạy được 5 km liên tục, sau đó tăng dần lên 10 km. Hoặc chơi cầu lông, bóng đá, bơi cùng bạn bè.',
  }),
  routine('sun-exercise', {
    title: 'Giãn cơ, yoga và đi bộ',
    time: '06:45',
    duration: 45,
    category: 'health',
    days: [0],
    note: 'Buổi phục hồi: 20 phút giãn cơ hoặc yoga, 25 phút đi bộ nhẹ. Không tập nặng.',
  }),
  routine('we-breakfast', {
    title: 'Ăn sáng',
    time: '07:45',
    duration: 30,
    category: 'life',
    days: WEEKEND,
    note: 'Ăn sáng thong thả, không vội.',
  }),
  routine('we-anki', {
    title: 'Ôn Anki',
    time: '08:15',
    duration: 15,
    category: 'study',
    days: WEEKEND,
    note: 'Chỉ ôn lại, không thêm từ mới. Giữ chuỗi ôn mỗi ngày, không bỏ ngày nào.',
  }),
  routine('sat-project', {
    title: 'Làm dự án kiếm thêm (khối lớn)',
    time: '08:30',
    duration: 180,
    category: 'money',
    important: true,
    days: [6],
    note:
      'Buổi làm sâu nhất trong tuần: tắt thông báo, cứ 50 phút nghỉ 10 phút. Gợi ý hướng làm hợp với bạn: ' +
      '(a) template hoặc thư viện .NET bán trên Gumroad hay Lemon Squeezy; ' +
      '(b) micro-SaaS cho doanh nghiệp nhỏ ở Việt Nam, ví dụ chatbot Zalo OA chạy bằng LLM; ' +
      '(c) MCP server hoặc tiện ích cho lập trình viên; ' +
      '(d) kênh nội dung tiếng Việt về .NET + AI. ' +
      'Chọn MỘT hướng và theo ít nhất 3 tháng. Hỏi ý kiến người dùng thật trước khi xây.',
  }),
  routine('sun-deepwork', {
    title: 'Hoàn thiện bài .NET/AI của tuần',
    time: '08:30',
    duration: 120,
    category: 'work',
    important: true,
    days: [0],
    note:
      'Hoàn thiện những gì học dở trong tuần: viết README, thêm test, dọn code, push lên GitHub. ' +
      'Mục tiêu sau 6 tháng: GitHub có 10–15 repo chất lượng làm portfolio.',
  }),
  routine('sun-chores', {
    title: 'Dọn nhà, giặt đồ, đi chợ',
    time: '10:30',
    duration: 60,
    category: 'life',
    days: [0],
    note: 'Chuẩn bị sẵn cho cả tuần: quần áo, đồ ăn sáng, góc làm việc gọn gàng.',
  }),
  routine('we-lunch', {
    title: 'Ăn trưa và ngủ trưa',
    time: '11:30',
    duration: 120,
    category: 'life',
    days: WEEKEND,
    note: 'Ăn trưa rồi ngủ trưa 20–30 phút, không quá 30 phút để chiều không bị lừ đừ. Thời gian còn lại nghỉ tùy thích.',
  }),
  routine('sat-english', {
    title: 'Tiếng Anh: đọc truyện và viết nhật ký',
    time: '14:00',
    duration: 90,
    category: 'study',
    important: true,
    days: [6],
    note:
      '45 phút đọc truyện phân cấp độ (graded readers) như Oxford Bookworms hoặc Penguin Readers: bắt đầu từ Level 1 (khoảng 400 từ), ' +
      'đọc hiểu được 90% thì lên cấp. Đây là cách nhanh nhất để từ vựng "ngấm" tự nhiên. ' +
      '45 phút viết nhật ký tuần bằng tiếng Anh: tháng đầu 5 câu đơn giản, dần tăng lên 10–15 câu. Nhờ Claude sửa, giải thích lỗi bằng tiếng Việt, rồi tự chép lại bản đúng.',
  }),
  routine('sun-english', {
    title: 'Tiếng Anh: ôn tập và kiểm tra tuần',
    time: '14:00',
    duration: 90,
    category: 'study',
    important: true,
    days: [0],
    note:
      '30 phút: làm lại bài tập ngữ pháp của cả tuần mà không nhìn đáp án. ' +
      '30 phút: nhờ Claude ra đề kiểm tra 20 câu về ngữ pháp và từ vựng đã học trong tuần, chấm điểm và ghi lại. ' +
      '30 phút: nói chuyện với Claude bằng giọng nói về tuần vừa qua. ' +
      'Cuối mỗi tháng làm bài kiểm tra miễn phí EF SET để biết mình đang ở mức A1, A2, B1… và ghi lại kết quả.',
  }),
  routine('we-reading', {
    title: 'Đọc sách',
    time: '15:30',
    duration: 60,
    category: 'personal',
    days: WEEKEND,
    note: 'Đọc tiếp cuốn đang đọc. Đọc xong cuốn nào thì viết 5 ý chính đáng nhớ nhất.',
  }),
  routine('we-free', {
    title: 'Giải trí tự do',
    time: '16:30',
    duration: 120,
    category: 'life',
    days: WEEKEND,
    note: 'Đi cà phê, gặp bạn bè, đi dạo, chơi game. Thời gian này không học gì cả, nạp lại năng lượng cho tuần sau.',
  }),
  routine('we-dinner', {
    title: 'Ăn tối',
    time: '18:30',
    duration: 60,
    category: 'life',
    days: WEEKEND,
  }),
  routine('sat-movie', {
    title: 'Xem phim tiếng Anh có phụ đề song ngữ',
    time: '20:00',
    duration: 60,
    category: 'study',
    days: [6],
    note:
      'Dùng tiện ích Language Reactor trên Chrome (cho Netflix và YouTube) để hiện phụ đề Anh và Việt cùng lúc. ' +
      'Chọn phim đời thường, nói chậm như Friends, Modern Family. Khi lên B1 thì tắt phụ đề tiếng Việt. ' +
      'Câu nào hay thì dừng lại, nói theo, rồi thêm vào Anki.',
  }),
  routine('sun-review', {
    title: 'Tổng kết tuần và lên kế hoạch tuần sau',
    time: '20:00',
    duration: 45,
    category: 'personal',
    important: true,
    days: [0],
    note:
      'Mở màn Nhật ký xem tuần này xong được bao nhiêu việc. Trả lời ba câu: việc gì hiệu quả, việc gì cần bỏ, tuần sau tập trung vào đâu. ' +
      'Chọn bài ngữ pháp và chủ đề .NET/AI cho tuần tới. Cuối tháng xem lại cả bốn tuần và kết quả EF SET.',
  }),
]
