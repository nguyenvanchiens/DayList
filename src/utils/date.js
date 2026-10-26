export const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
export const WEEKDAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
export const MONTHS = [
  'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
  'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai',
]

export const DAY_MS = 86400000

const pad = (n) => String(n).padStart(2, '0')

// Ngày được lưu dạng "YYYY-MM-DD" theo giờ địa phương để so sánh chuỗi trực tiếp
export const toKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayKey = () => toKey()

export const addDays = (key, n) => {
  const d = fromKey(key)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

const diffDays = (key, base) => Math.round((fromKey(key) - fromKey(base)) / DAY_MS)

export function relativeLabel(key, today = todayKey()) {
  const diff = diffDays(key, today)
  if (diff === 0) return 'Hôm nay'
  if (diff === 1) return 'Ngày mai'
  if (diff === -1) return 'Hôm qua'
  const d = fromKey(key)
  if (diff > 1 && diff < 7) return WEEKDAYS[d.getDay()]
  const sameYear = d.getFullYear() === fromKey(today).getFullYear()
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}${sameYear ? '' : '/' + d.getFullYear()}`
}

export const clock = (ms) => {
  const d = new Date(ms)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const minutesOf = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// 45 → "45 phút", 90 → "1h30", 120 → "2 giờ"
export function fmtDuration(min) {
  const total = Math.round(min)
  if (total < 60) return `${total} phút`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m ? `${h}h${pad(m)}` : `${h} giờ`
}

export function fmtElapsed(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`
}
