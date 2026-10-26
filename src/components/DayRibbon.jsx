const HOUR = 3600000

// Dải thời gian trong ngày: mỗi việc có giờ là một khối, việc đã tích xong được tô đậm
export default function DayRibbon({ dayStart, now, blocks }) {
  const earliest = Math.min(...blocks.map((b) => (b.s - dayStart) / HOUR), 6)
  const startH = Math.max(0, Math.floor(earliest))
  const endH = 24
  const span = (endH - startH) * HOUR
  const pos = (ms) => Math.min(100, Math.max(0, ((ms - dayStart - startH * HOUR) / span) * 100))
  const ticks = []
  for (let h = Math.ceil(startH / 3) * 3; h <= endH; h += 3) ticks.push(h)
  const showNeedle = now >= dayStart + startH * HOUR && now < dayStart + endH * HOUR

  return (
    <div className="ribbon">
      <div className="ribbon-track">
        {blocks.map((b) => (
          <i
            key={b.key}
            className={b.done ? 'done' : ''}
            style={{ left: `${pos(b.s)}%`, width: `${Math.max(0.8, pos(b.e) - pos(b.s))}%`, '--c': b.color }}
            title={b.title}
          />
        ))}
        {ticks.map((h) => (
          <span key={h} className="tick" style={{ left: `${pos(dayStart + h * HOUR)}%` }} />
        ))}
        {showNeedle && <span className="needle" style={{ left: `${pos(now)}%` }} />}
      </div>
      <div className="ribbon-scale">
        {ticks.map((h) => (
          <span key={h} style={{ left: `${pos(dayStart + h * HOUR)}%` }}>
            {h}h
          </span>
        ))}
      </div>
      <div className="ribbon-legend">
        <span>
          <i /> Chưa làm
        </span>
        <span>
          <i className="done" /> Đã xong
        </span>
      </div>
    </div>
  )
}
