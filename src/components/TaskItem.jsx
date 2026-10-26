import { useRef, useState } from 'react'
import Icon from './Icon'
import { CATEGORY_MAP } from '../constants'
import { clock, fmtDuration, relativeLabel } from '../utils/date'

const SWIPE_LIMIT = 130
const SWIPE_TRIGGER = 85

export default function TaskItem({ task, today, onToggle, onOpen, onDelete }) {
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef(null)
  const moved = useRef(false)

  const category = CATEGORY_MAP[task.category] ?? CATEGORY_MAP.personal
  const overdue = !task.done && task.due && task.due < today

  // Vuốt trái để xóa, vuốt phải để tích xong – chỉ "khóa" trục ngang khi người dùng kéo ngang rõ ràng
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    start.current = { x: e.clientX, y: e.clientY, axis: null }
    moved.current = false
  }

  const onPointerMove = (e) => {
    const s = start.current
    if (!s) return
    const mx = e.clientX - s.x
    const my = e.clientY - s.y
    if (!s.axis) {
      if (Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) {
        s.axis = 'x'
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
      } else if (Math.abs(my) > 8) {
        s.axis = 'y'
      }
    }
    if (s.axis === 'x') {
      moved.current = true
      setDx(Math.max(-SWIPE_LIMIT, Math.min(SWIPE_LIMIT, mx)))
    }
  }

  const onPointerEnd = () => {
    if (start.current?.axis === 'x') {
      if (dx <= -SWIPE_TRIGGER) onDelete(task.id)
      else if (dx >= SWIPE_TRIGGER) onToggle(task.id)
    }
    start.current = null
    setDx(0)
    setDragging(false)
  }

  return (
    <li className={`row-wrap${dx > 0 ? ' swipe-right' : dx < 0 ? ' swipe-left' : ''}`}>
      <div className={`swipe-bg left${dx >= SWIPE_TRIGGER ? ' armed' : ''}`}>
        <Icon name={task.done ? 'x' : 'check'} size={18} strokeWidth={2.6} />
        {task.done ? 'Chưa xong' : 'Xong'}
      </div>
      <div className={`swipe-bg right${dx <= -SWIPE_TRIGGER ? ' armed' : ''}`}>
        Xóa
        <Icon name="trash" size={18} />
      </div>

      <div
        className={`row${task.done ? ' done' : ''}${dragging ? ' dragging' : ''}`}
        style={{ '--c': category.color, transform: dx ? `translateX(${dx}px)` : undefined }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClick={() => !moved.current && onOpen(task)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpen(task)}
      >
        <div className="row-time">
          <b className={task.time ? '' : 'free'}>{task.time || 'Linh hoạt'}</b>
          <span>{fmtDuration(task.duration)}</span>
        </div>

        <div className="row-body">
          <div className="row-title">
            {task.important && <Icon name="star" size={14} className="star" />}
            {task.title}
          </div>
          {task.note && <div className="row-note">{task.note}</div>}
          <div className="row-meta">
            <span className="cat">
              <i />
              {category.name}
            </span>
            {task.routineId && (
              <span className="repeat">
                <Icon name="repeat" size={12} />
                Lặp lại
              </span>
            )}
            {overdue &&<span className="late">Hạn {relativeLabel(task.due, today).toLowerCase()}</span>}
            {task.done && task.doneAt && <span>Xong lúc {clock(task.doneAt)}</span>}
          </div>
        </div>

        <button
          className="check"
          aria-label={task.done ? 'Bỏ đánh dấu xong' : 'Đánh dấu đã xong'}
          onClick={(e) => {
            e.stopPropagation()
            onToggle(task.id)
          }}
        >
          <Icon name="check" size={16} strokeWidth={3} />
        </button>
      </div>
    </li>
  )
}
