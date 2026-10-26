export const CATEGORIES = [
  { id: 'work', name: 'Công việc', color: '#2b5cc8' },
  { id: 'personal', name: 'Cá nhân', color: '#2f8a5b' },
  { id: 'shopping', name: 'Mua sắm', color: '#c2850f' },
  { id: 'health', name: 'Sức khỏe', color: '#c8365d' },
  { id: 'study', name: 'Học tập', color: '#7a4bc2' },
  { id: 'money', name: 'Kiếm thêm', color: '#0e7c86' },
  { id: 'life', name: 'Nghỉ ngơi', color: '#a0703a' },
]

// Lựa chọn nhanh cho việc lặp lại; days theo Date.getDay() (0 = Chủ nhật)
export const REPEAT_PRESETS = [
  { label: 'Không lặp', days: [] },
  { label: 'Hằng ngày', days: [0, 1, 2, 3, 4, 5, 6] },
  { label: 'Thứ 2 – Thứ 6', days: [1, 2, 3, 4, 5] },
  { label: 'Cuối tuần', days: [0, 6] },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

export const DURATIONS = [15, 30, 45, 60, 90, 120, 180]

export const VIEWS = [
  { id: 'today', name: 'Hôm nay', icon: 'sun' },
  { id: 'upcoming', name: 'Sắp tới', icon: 'calendar' },
  { id: 'journal', name: 'Nhật ký', icon: 'book' },
]

// Câu in cuối tờ lịch, đổi theo ngày
export const PROVERBS = [
  'Việc hôm nay chớ để ngày mai.',
  'Có công mài sắt, có ngày nên kim.',
  'Kiến tha lâu cũng đầy tổ.',
  'Năng nhặt chặt bị.',
  'Ăn có giờ, làm có buổi.',
  'Chậm mà chắc.',
  'Một năm khởi đầu từ mùa xuân, một ngày khởi đầu từ buổi sáng.',
  'Thời gian là vàng bạc.',
  'Muốn ăn thì lăn vào bếp.',
  'Đi một ngày đàng, học một sàng khôn.',
  'Nước chảy đá mòn.',
  'Tích tiểu thành đại.',
]
