import { CATEGORY_MAP } from '../constants'
import { DAY_MS, WEEKDAYS_SHORT, addDays, clock, fmtDuration, fromKey, relativeLabel } from '../utils/date'
import { doneBetween, sumDuration } from '../utils/tasks'

const HISTORY_DAYS = 14

export default function JournalView({ tasks, today, actions }) {
  const days = Array.from({ length: HISTORY_DAYS }, (_, i) => {
    const key = addDays(today, -i)
    const start = fromKey(key).getTime()
    const items = tasks.filter((t) => doneBetween(t, start, start + DAY_MS)).sort((a, b) => a.doneAt - b.doneAt)
    return { key, start, items, minutes: sumDuration(items) }
  })

  const week = days.slice(0, 7).reverse()
  const weekCount = week.reduce((sum, d) => sum + d.items.length, 0)
  const weekMin = week.reduce((sum, d) => sum + d.minutes, 0)
  const max = Math.max(...week.map((d) => d.items.length), 4)

  return (
    <>
      <h1 className="view-title">Nhật ký</h1>

      <section className="panel">
        <p className="week-sum">
          7 ngày qua bạn đã xong <b>{weekCount} việc</b>
          {weekMin > 0 && (
            <>
              , khoảng <b>{fmtDuration(weekMin)}</b>
            </>
          )}
          .
        </p>
        <div className="week-chart" role="img" aria-label="Số việc đã xong mỗi ngày trong 7 ngày qua">
          {week.map((d) => (
            <div key={d.key} className={`bar${d.key === today ? ' today' : ''}`}>
              <span className="bar-val">{d.items.length || ''}</span>
              <div className="bar-track">
                <i style={{ height: `${(d.items.length / max) * 100}%` }} />
              </div>
              <span className="bar-day">{WEEKDAYS_SHORT[new Date(d.start).getDay()]}</span>
            </div>
          ))}
        </div>
      </section>

      {weekCount === 0 && days.every((d) => d.items.length === 0) && (
        <div className="empty">
          <p>Mỗi việc bạn tích xong sẽ được ghi lại ở đây theo từng ngày.</p>
        </div>
      )}

      {days
        .filter((d) => d.items.length)
        .map((d) => (
          <section className="panel" key={d.key}>
            <header className="panel-head">
              <h2>{relativeLabel(d.key, today)}</h2>
              <span>
                {d.items.length} việc, {fmtDuration(d.minutes)}
              </span>
            </header>
            <ul className="log">
              {d.items.map((task) => (
                <li key={task.id} style={{ '--c': CATEGORY_MAP[task.category]?.color }} onClick={() => actions.onOpen(task)}>
                  <time>{clock(task.doneAt)}</time>
                  <i className="mark done" />
                  <div>
                    <b>{task.title}</b>
                    <span>
                      {CATEGORY_MAP[task.category]?.name}, {fmtDuration(task.duration)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </>
  )
}
