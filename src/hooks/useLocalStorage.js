import { useEffect, useState } from 'react'

const resolve = (v) => (typeof v === 'function' ? v() : v)

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : resolve(initial)
    } catch {
      return resolve(initial)
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Bộ nhớ đầy hoặc bị chặn (chế độ ẩn danh) – bỏ qua, app vẫn chạy trong phiên hiện tại
    }
  }, [key, value])

  return [value, setValue]
}
