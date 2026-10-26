import CalendarPage from '../components/CalendarPage'
import TaskItem from '../components/TaskItem'
import { CATEGORY_MAP } from '../constants'
import { DAY_MS, fmtDuration, fromKey, minutesOf } from '../utils/date'
import { compareAgenda, doneBetween, sumDuration } from '../utils/tasks'

export default function TodayView({ tasks, today, now, actions }) {
  const dayStart = fromKey(today).getTime()
  const dayEnd = dayStart + DAY_MS

  const plan = tasks.filter((t) => !t.done && t.due && t.due <= today).sort(compareAgenda)
  const doneToday = tasks.filter((t) => doneBetween(t, dayStart, dayEnd)).sort((a, b) => b.doneAt - a.doneAt)
  // Việc của hôm nay = còn phải làm + đã tích xong hôm nay
  const dayTasks = [...plan, ...doneToday]

  const blocks = dayTasks
    .filter((t) => t.time && t.due === today)
    .map((t) => {
      const s = dayStart + minutesOf(t.time) * 60000
      return { key: t.id, s, e: s + t.duration * 60000, color: CATEGORY_MAP[t.category]?.color, done: t.done, title: t.title }
    })

  return (
    <div className="today-grid">
      <div className="today-cal">
        <CalendarPage
          now={now}
          dayStart={dayStart}
          doneCount={doneToday.length}
          totalCount={dayTasks.length}
          doneMin={sumDuration(doneToday)}
          plannedMin={sumDuration(dayTasks)}
          blocks={blocks}
        />
      </div>

      <div className="today-lists">
        <section className="panel">
          <header className="panel-head">
            <h2>Cần làm</h2>
            {plan.length > 0 && (
              <span>
                {plan.length} việc, khoảng {fmtDuration(sumDuration(plan))}
              </span>
            )}
          </header>
          {plan.length ? (
            <ul className="rows">
              {plan.map((t) => (
                <TaskItem key={t.id} task={t} today={today} {...actions} />
              ))}
            </ul>
          ) : (
            <div className="empty">
              <p>{doneToday.length ? 'Đã xong hết việc hôm nay.' : 'Hôm nay chưa có việc nào.'}</p>
              <button className="btn outline" onClick={() => actions.onAdd(today)}>
                Thêm việc cho hôm nay
              </button>
            </div>
          )}
        </section>

        {doneToday.length > 0 && (
          <section className="panel">
            <header className="panel-head">
              <h2>Đã xong hôm nay</h2>
              <span>{fmtDuration(sumDuration(doneToday))}</span>
            </header>
            <ul className="rows">
              {doneToday.map((t) => (
                <TaskItem key={t.id} task={t} today={today} {...actions} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
