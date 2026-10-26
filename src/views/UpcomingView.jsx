import { useState } from 'react'
import Icon from '../components/Icon'
import TaskItem from '../components/TaskItem'
import { CATEGORY_MAP } from '../constants'
import { fmtDuration, relativeLabel } from '../utils/date'
import { compareAgenda, fold, repeatLabel, sumDuration } from '../utils/tasks'

export default function UpcomingView({ tasks, routines, today, actions }) {
  const [query, setQuery] = useState('')
  const q = fold(query.trim())

  const pending = tasks.filter((t) => !t.done && (!q || fold(t.title).includes(q) || fold(t.note).includes(q)))
  const groups = new Map()
  for (const t of pending.filter((t) => t.due > today).sort((a, b) => a.due.localeCompare(b.due))) {
    if (!groups.has(t.due)) groups.set(t.due, [])
    groups.get(t.due).push(t)
  }
  const sections = [...groups].map(([due, items]) => ({ key: due, title: relativeLabel(due, today), items }))
  const undated = pending.filter((t) => !t.due)
  if (undated.length) sections.push({ key: 'undated', title: 'Chưa định ngày', items: undated })
  if (q) {
    const current = pending.filter((t) => t.due && t.due <= today)
    if (current.length) sections.unshift({ key: 'current', title: 'Hôm nay và trễ hạn', items: current })
  }
  const shownRoutines = routines
    .filter((r) => !q || fold(r.title).includes(q) || fold(r.note).includes(q))
    .sort((a, b) => a.time.localeCompare(b.time) || a.title.localeCompare(b.title))

  return (
    <>
      <h1 className="view-title">Sắp tới</h1>
      <label className="search">
        <Icon name="search" size={18} />
        <input type="search" placeholder="Tìm việc" value={query} onChange={(e) => setQuery(e.target.value)} />
        {query && (
          <button className="icon-btn" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm">
            <Icon name="x" size={16} />
          </button>
        )}
      </label>

      {sections.length === 0 && (!q || shownRoutines.length === 0) && (
        <div className="empty">
          <p>{q ? `Không có việc nào khớp “${query.trim()}”.` : 'Chưa có việc nào cho những ngày tới.'}</p>
          {!q && (
            <button className="btn outline" onClick={() => actions.onAdd('')}>
              Lên lịch một việc
            </button>
          )}
        </div>
      )}

      {sections.map((s) => (
        <section className="panel" key={s.key}>
          <header className="panel-head">
            <h2>{s.title}</h2>
            <span>
              {s.items.length} việc, {fmtDuration(sumDuration(s.items))}
            </span>
          </header>
          <ul className="rows">
            {s.items.sort(compareAgenda).map((t) => (
              <TaskItem key={t.id} task={t} today={today} {...actions} />
            ))}
          </ul>
        </section>
      ))}

      {shownRoutines.length > 0 && (
        <section className="panel">
          <header className="panel-head">
            <h2>Việc lặp lại</h2>
            <span>{routines.length} việc</span>
          </header>
          <ul className="routines">
            {shownRoutines.map((r) => (
              <li key={r.id}>
                <button style={{ '--c': CATEGORY_MAP[r.category]?.color }} onClick={() => actions.onOpenRoutine(r)}>
                  <b>{r.time || 'Linh hoạt'}</b>
                  <span className="routine-body">
                    <strong>
                      {r.important && <Icon name="star" size={13} className="star" />}
                      {r.title}
                    </strong>
                    <span>
                      <i />
                      {repeatLabel(r.days)}, {fmtDuration(r.duration)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
