import DayRibbon from './DayRibbon'
import { PROVERBS } from '../constants'
import { DAY_MS, MONTHS, WEEKDAYS, fmtDuration } from '../utils/date'
import { canChiYear, lunarMonthName, solarToLunar } from '../utils/lunar'

export default function CalendarPage({ now, dayStart, doneCount, totalCount, doneMin, plannedMin, blocks }) {
  const d = new Date(now)
  const lunar = solarToLunar(d.getDate(), d.getMonth() + 1, d.getFullYear())
  const proverb = PROVERBS[Math.floor(dayStart / DAY_MS) % PROVERBS.length]
  const lunarTag = lunar.day === 1 ? 'Mùng một' : lunar.day === 15 ? 'Ngày rằm' : null

  return (
    <section className="cal" aria-label="Tờ lịch hôm nay">
      <div className="cal-band">
        <span className="hole" />
        <span>
          {MONTHS[d.getMonth()]}, {d.getFullYear()}
        </span>
        <span className="hole" />
      </div>

      <div className="cal-face">
        <div className={`cal-day${d.getDay() === 0 ? ' sunday' : ''}`}>{d.getDate()}</div>
        <div className="cal-weekday">{WEEKDAYS[d.getDay()]}</div>
      </div>

      <div className="cal-row">
        <p className="proverb">{proverb}</p>
        <div className="lunar">
          <b>{lunar.day}</b>
          <span>
            tháng {lunarMonthName(lunar.month)}
            {lunar.leap && ' nhuận'}
            <br />
            năm {canChiYear(lunar.year)}
          </span>
          {lunarTag && <em>{lunarTag}</em>}
        </div>
      </div>

      <div className="cal-stats">
        {totalCount > 0 ? (
          <p>
            Đã xong <b>{doneCount}/{totalCount}</b> việc, <b>{fmtDuration(doneMin)}</b> trên <b>{fmtDuration(plannedMin)}</b> dự kiến
          </p>
        ) : (
          <p>Hôm nay chưa có việc nào.</p>
        )}
        <DayRibbon dayStart={dayStart} now={now} blocks={blocks} />
      </div>
    </section>
  )
}
