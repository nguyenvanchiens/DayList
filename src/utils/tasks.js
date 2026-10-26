import { WEEKDAYS_SHORT } from './date'

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

// Bỏ dấu tiếng Việt để tìm "mua rau" khớp cả "Mua rau"
export const fold = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()

const DEFAULTS = {
  note: '',
  due: '',
  time: '',
  duration: 30,
  category: 'personal',
  important: false,
  done: false,
  doneAt: null,
  routineId: null,
}

// Dữ liệu từ bản cũ có thể thiếu thời lượng hoặc dùng "priority" – bổ sung khi đọc
export const normalizeTask = ({ sessions, priority, ...t }) => ({
  ...DEFAULTS,
  ...t,
  important: t.important ?? priority === 'high',
})

export const doneBetween = (t, from, to) => t.done && t.doneAt >= from && t.doneAt < to

// Việc có giờ cố định xếp trước theo giờ, sau đó tới việc quan trọng, rồi theo thứ tự tạo
export const compareAgenda = (a, b) =>
  (a.time ? 0 : 1) - (b.time ? 0 : 1) ||
  a.time.localeCompare(b.time) ||
  b.important - a.important ||
  (a.due || '9999').localeCompare(b.due || '9999') ||
  a.createdAt - b.createdAt

export const sumDuration = (list) => list.reduce((sum, t) => sum + t.duration, 0)

// Các trường dùng chung giữa việc lặp lại (mẫu) và việc của từng ngày
export const pickRoutineFields = ({ title, note, time, duration, category, important }) => ({
  title,
  note,
  time,
  duration,
  category,
  important,
})

export const instanceOf = (routine, day) => ({
  ...DEFAULTS,
  ...pickRoutineFields(routine),
  id: uid(),
  routineId: routine.id,
  due: day,
  createdAt: Date.now(),
})

const ORDER = [1, 2, 3, 4, 5, 6, 0]

export function repeatLabel(days) {
  const set = [...new Set(days)]
  if (set.length === 7) return 'Hằng ngày'
  const key = ORDER.filter((d) => set.includes(d)).join()
  if (key === '1,2,3,4,5') return 'Thứ 2 – Thứ 6'
  if (key === '6,0') return 'Cuối tuần'
  return ORDER.filter((d) => set.includes(d))
    .map((d) => WEEKDAYS_SHORT[d])
    .join(', ')
}
