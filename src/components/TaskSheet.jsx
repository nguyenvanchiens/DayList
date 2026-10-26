import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { CATEGORIES, DURATIONS, REPEAT_PRESETS } from '../constants'
import { WEEKDAYS_SHORT, addDays, fmtDuration, todayKey } from '../utils/date'

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]
const sameDays = (a, b) => a.length === b.length && a.every((d) => b.includes(d))

// Dùng cho 3 trường hợp: việc thường, việc của một ngày sinh ra từ lịch lặp, và sửa trực tiếp lịch lặp
export default function TaskSheet({ task, routine, defaults, onClose, onSave, onDelete, onDeleteRoutine }) {
  const isEdit = Boolean(task || routine)
  const source = task ?? routine
  const today = todayKey()
  const [form, setForm] = useState(() =>
    source
      ? {
          title: source.title,
          note: source.note,
          due: task?.due ?? today,
          time: source.time,
          duration: source.duration,
          category: source.category,
          important: source.important,
          days: routine?.days ?? [],
        }
      : { title: '', note: '', due: defaults.due, time: '', duration: 30, category: 'personal', important: false, days: [] },
  )
  const [closing, setClosing] = useState(false)
  const titleRef = useRef(null)
  const repeating = form.days.length > 0

  const close = useCallback(() => {
    setClosing(true)
    setTimeout(onClose, 200)
  }, [onClose])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    }
  }, [close])

  useEffect(() => {
    if (!isEdit) {
      const id = setTimeout(() => titleRef.current?.focus(), 240)
      return () => clearTimeout(id)
    }
  }, [isEdit])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const toggleDay = (d) => set('days', form.days.includes(d) ? form.days.filter((x) => x !== d) : [...form.days, d])

  const submit = (e) => {
    e.preventDefault()
    const title = form.title.trim()
    if (!title) {
      titleRef.current?.focus()
      return
    }
    onSave({
      ...form,
      title,
      note: form.note.trim(),
      time: repeating || form.due ? form.time : '',
      duration: Math.max(5, Number(form.duration) || 30),
    })
    close()
  }

  const quickDates = [
    { label: 'Hôm nay', value: today },
    { label: 'Ngày mai', value: addDays(today, 1) },
    { label: 'Tuần sau', value: addDays(today, 7) },
    { label: 'Chưa định', value: '' },
  ]
  const timeEnabled = repeating || Boolean(form.due)

  return (
    <div className={`sheet-layer${closing ? ' closing' : ''}`}>
      <div className="backdrop" onClick={close} />
      <form className="sheet" onSubmit={submit} role="dialog" aria-modal="true" aria-label={isEdit ? 'Sửa việc' : 'Thêm việc'}>
        <div className="sheet-head">
          <h2>{routine && !task ? 'Sửa việc lặp lại' : isEdit ? 'Sửa việc' : 'Việc mới'}</h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Đóng">
            <Icon name="x" size={18} />
          </button>
        </div>

        <input
          ref={titleRef}
          className="title-input"
          placeholder="Bạn sẽ làm gì?"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          maxLength={120}
          enterKeyHint="done"
        />
        <textarea
          className="note-input"
          placeholder="Ghi chú"
          value={form.note}
          onChange={(e) => set('note', e.target.value)}
          rows={form.note.length > 160 ? 6 : 2}
        />

        <fieldset className="field">
          <legend>Dự kiến mất bao lâu</legend>
          <div className="chips">
            {DURATIONS.map((m) => (
              <button type="button" key={m} className={`chip${form.duration === m ? ' on' : ''}`} onClick={() => set('duration', m)}>
                {fmtDuration(m)}
              </button>
            ))}
            <label className={`chip custom${DURATIONS.includes(form.duration) ? '' : ' on'}`}>
              <input
                type="number"
                min="5"
                max="720"
                step="5"
                inputMode="numeric"
                value={DURATIONS.includes(form.duration) ? '' : form.duration}
                placeholder="Khác"
                onChange={(e) => set('duration', e.target.value === '' ? 30 : Number(e.target.value))}
              />
              phút
            </label>
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Lặp lại</legend>
          <div className="chips">
            {REPEAT_PRESETS.map((p) => (
              <button
                type="button"
                key={p.label}
                className={`chip${sameDays(form.days, p.days) ? ' on' : ''}`}
                onClick={() => set('days', p.days)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="weekdays" role="group" aria-label="Chọn thứ trong tuần">
            {WEEK_ORDER.map((d) => (
              <button
                type="button"
                key={d}
                className={form.days.includes(d) ? 'on' : ''}
                aria-pressed={form.days.includes(d)}
                onClick={() => toggleDay(d)}
              >
                {WEEKDAYS_SHORT[d]}
              </button>
            ))}
          </div>
        </fieldset>

        {!repeating && (
          <fieldset className="field">
            <legend>Ngày làm</legend>
            <div className="chips">
              {quickDates.map((q) => (
                <button type="button" key={q.label} className={`chip${form.due === q.value ? ' on' : ''}`} onClick={() => set('due', q.value)}>
                  {q.label}
                </button>
              ))}
            </div>
            <label className="input-box single">
              <Icon name="calendar" size={16} />
              <input type="date" value={form.due} onChange={(e) => set('due', e.target.value)} aria-label="Chọn ngày" />
            </label>
          </fieldset>
        )}

        <fieldset className="field">
          <legend>Giờ bắt đầu</legend>
          <label className={`input-box single${timeEnabled ? '' : ' off'}`}>
            <Icon name="clock" size={16} />
            <input type="time" value={form.time} disabled={!timeEnabled} onChange={(e) => set('time', e.target.value)} aria-label="Giờ bắt đầu" />
            {form.time && (
              <button type="button" className="clear" onClick={() => set('time', '')} aria-label="Bỏ giờ">
                <Icon name="x" size={14} />
              </button>
            )}
          </label>
          <p className="field-hint">
            {!timeEnabled ? 'Chọn ngày làm để đặt giờ.' : !form.time ? 'Không đặt giờ: việc nằm trong mục linh hoạt.' : ' '}
          </p>
        </fieldset>

        <fieldset className="field">
          <legend>Nhóm</legend>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`chip cat${form.category === c.id ? ' on' : ''}`}
                style={{ '--c': c.color }}
                onClick={() => set('category', c.id)}
              >
                <i />
                {c.name}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="toggle">
          <input type="checkbox" checked={form.important} onChange={(e) => set('important', e.target.checked)} />
          <span className="toggle-ui" />
          Việc quan trọng
        </label>

        {routine && (
          <button
            type="button"
            className="link-danger"
            onClick={() => {
              onDeleteRoutine(routine.id)
              close()
            }}
          >
            <Icon name="repeat" size={15} />
            Xóa hẳn việc lặp lại này
          </button>
        )}

        <div className="sheet-actions">
          {task && (
            <button
              type="button"
              className="btn ghost-danger"
              onClick={() => {
                onDelete(task.id)
                close()
              }}
            >
              <Icon name="trash" size={17} />
              {routine ? 'Bỏ hôm nay' : 'Xóa'}
            </button>
          )}
          <button type="submit" className="btn primary" disabled={!form.title.trim()}>
            {isEdit ? 'Lưu' : 'Thêm việc'}
          </button>
        </div>
      </form>
    </div>
  )
}
