import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { VIEWS } from './constants'
import { DEFAULT_ROUTINES, RETIRED_ROUTINE_IDS, SCHEDULE_VERSION } from './data/schedule'
import { fromKey, toKey } from './utils/date'
import { instanceOf, normalizeTask, pickRoutineFields, uid } from './utils/tasks'
import Icon from './components/Icon'
import TaskSheet from './components/TaskSheet'
import InstallBanner from './components/InstallBanner'
import TodayView from './views/TodayView'
import UpcomingView from './views/UpcomingView'
import JournalView from './views/JournalView'

const THEMES = [
  { id: 'system', icon: 'monitor', label: 'Giao diện theo máy' },
  { id: 'light', icon: 'sun', label: 'Giao diện sáng' },
  { id: 'dark', icon: 'moon', label: 'Giao diện tối' },
]

const VIEW_COMPONENTS = { today: TodayView, upcoming: UpcomingView, journal: JournalView }

function useTheme(theme) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#10141c' : '#e7ebf1')
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])
}

// Cập nhật đồng hồ mỗi phút (kim giờ trên dải thời gian, sang ngày mới)
function useNow(intervalMs) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const tick = () => setNow(Date.now())
    const id = setInterval(tick, intervalMs)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [intervalMs])
  return now
}

export default function App() {
  const [rawTasks, setTasks] = useLocalStorage('todolife.tasks', [])
  const [routines, setRoutines] = useLocalStorage('todolife.routines', DEFAULT_ROUTINES)
  // Những việc lặp lại đã được sinh ra cho hôm nay – để việc đã "bỏ hôm nay" không bị tạo lại
  const [generated, setGenerated] = useLocalStorage('todolife.generated', { day: '', ids: [] })
  // Máy đã có lịch từ trước mà chưa ghi phiên bản = lịch bản 1
  const [scheduleVersion, setScheduleVersion] = useLocalStorage('todolife.scheduleVersion', () =>
    localStorage.getItem('todolife.routines') ? 1 : SCHEDULE_VERSION,
  )
  const [theme, setTheme] = useLocalStorage('todolife.theme', 'system')
  const [view, setView] = useLocalStorage('todolife.view', 'today')
  const [sheet, setSheet] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()
  const now = useNow(60000)
  const today = toKey(new Date(now))

  useTheme(theme)

  const tasks = useMemo(() => rawTasks.map(normalizeTask), [rawTasks])
  const weekday = fromKey(today).getDay()

  // Lịch mặc định có bản mới: thay các việc mặc định, giữ việc lặp lại người dùng tự thêm.
  // Việc chưa làm hôm nay của lịch cũ được bỏ để sinh lại theo giờ mới.
  useEffect(() => {
    if (scheduleVersion >= SCHEDULE_VERSION) return
    const managed = new Set([...DEFAULT_ROUTINES.map((r) => r.id), ...RETIRED_ROUTINE_IDS])
    setRoutines((rs) => [...DEFAULT_ROUTINES, ...rs.filter((r) => !managed.has(r.id))])
    setTasks((ts) => ts.filter((t) => !(managed.has(t.routineId) && !t.done)))
    setGenerated((g) => ({ ...g, ids: g.ids.filter((id) => !managed.has(id)) }))
    setScheduleVersion(SCHEDULE_VERSION)
  }, [scheduleVersion, setRoutines, setTasks, setGenerated, setScheduleVersion])

  // Mỗi ngày: sinh việc từ lịch lặp lại, dọn việc lặp của những ngày trước mà chưa làm (không tính là trễ hạn)
  useEffect(() => {
    if (scheduleVersion < SCHEDULE_VERSION) return
    const doneIds = generated.day === today ? generated.ids : []
    const pending = routines.filter((r) => r.days.includes(weekday) && !doneIds.includes(r.id))
    const stale = rawTasks.some((t) => t.routineId && !t.done && t.due < today)
    if (!pending.length && !stale && generated.day === today) return
    setTasks((ts) => [
      ...ts.filter((t) => !(t.routineId && !t.done && t.due < today)),
      ...pending.filter((r) => !ts.some((t) => t.routineId === r.id && t.due === today)).map((r) => instanceOf(r, today)),
    ])
    setGenerated({ day: today, ids: [...doneIds, ...pending.map((r) => r.id)] })
  }, [today, weekday, routines, generated, rawTasks, scheduleVersion, setTasks, setGenerated])

  const showToast = useCallback((message, undo) => {
    clearTimeout(toastTimer.current)
    setToast({ message, undo, id: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }, [])

  const saveTask = ({ days, ...data }) => {
    const routine = sheet.routine
    const editing = sheet.task

    if (routine && days.length) {
      // Sửa lịch lặp: cập nhật mẫu và cả việc hôm nay nếu chưa làm
      setRoutines((rs) => rs.map((r) => (r.id === routine.id ? { ...r, ...pickRoutineFields(data), days } : r)))
      setTasks((ts) =>
        ts.map((t) => (t.routineId === routine.id && t.due === today && !t.done ? { ...t, ...pickRoutineFields(data) } : t)),
      )
      return
    }

    if (routine) {
      // Chọn "Không lặp": ngừng lặp, việc hôm nay trở thành việc thường
      setRoutines((rs) => rs.filter((r) => r.id !== routine.id))
      setTasks((ts) =>
        ts.map((t) => (t.routineId !== routine.id ? t : t.id === editing?.id ? { ...t, ...data, routineId: null } : { ...t, routineId: null })),
      )
      showToast('Đã ngừng lặp lại')
      return
    }

    if (days.length) {
      const created = { id: uid(), ...pickRoutineFields(data), days }
      setRoutines((rs) => [...rs, created])
      if (editing && days.includes(weekday)) {
        // Biến việc đang sửa thành việc lặp của hôm nay
        setTasks((ts) => ts.map((t) => (t.id === editing.id ? { ...t, ...data, due: today, routineId: created.id } : t)))
        setGenerated((g) => ({ day: today, ids: [...(g.day === today ? g.ids : []), created.id] }))
      } else if (editing) {
        setTasks((ts) => ts.map((t) => (t.id === editing.id ? { ...t, ...data } : t)))
      }
      showToast('Đã tạo việc lặp lại')
      return
    }

    if (editing) {
      setTasks((ts) => ts.map((t) => (t.id === editing.id ? { ...t, ...data } : t)))
    } else {
      setTasks((ts) => [...ts, { id: uid(), done: false, doneAt: null, createdAt: Date.now(), ...data }])
      showToast('Đã thêm việc')
    }
  }

  const toggleTask = (id) => {
    navigator.vibrate?.(10)
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done, doneAt: t.done ? null : Date.now() } : t)))
  }

  const deleteTask = (id) => {
    const removed = rawTasks.find((t) => t.id === id)
    if (!removed) return
    setTasks((ts) => ts.filter((t) => t.id !== id))
    showToast(removed.routineId ? 'Đã bỏ việc này hôm nay' : 'Đã xóa việc', () => setTasks((ts) => [...ts, removed]))
  }

  const deleteRoutine = (id) => {
    const routine = routines.find((r) => r.id === id)
    const todays = rawTasks.filter((t) => t.routineId === id && !t.done)
    setRoutines((rs) => rs.filter((r) => r.id !== id))
    setTasks((ts) => ts.filter((t) => !(t.routineId === id && !t.done)))
    showToast('Đã xóa việc lặp lại', () => {
      setRoutines((rs) => [...rs, routine])
      setTasks((ts) => [...ts, ...todays])
    })
  }

  const routineOf = (task) => task?.routineId && routines.find((r) => r.id === task.routineId)

  const changeView = (id) => {
    setView(id)
    window.scrollTo({ top: 0 })
  }

  const cycleTheme = () => {
    const i = THEMES.findIndex((t) => t.id === theme)
    setTheme(THEMES[(i + 1) % THEMES.length].id)
  }

  const openAdd = (due = today) => setSheet({ task: null, defaults: { due } })
  const themeInfo = THEMES.find((t) => t.id === theme) ?? THEMES[0]
  const ViewComponent = VIEW_COMPONENTS[view] ?? TodayView

  const actions = {
    onToggle: toggleTask,
    onDelete: deleteTask,
    onOpen: (t) => setSheet({ task: t, routine: routineOf(t) || null }),
    onOpenRoutine: (r) => setSheet({ task: null, routine: r }),
    onAdd: openAdd,
  }

  const themeButton = (
    <button className="icon-btn" onClick={cycleTheme} aria-label={themeInfo.label} title={themeInfo.label}>
      <Icon name={themeInfo.icon} size={18} />
    </button>
  )

  return (
    <div className="app">
      <header className="topbar">
        <span className="wordmark">ToDoLife</span>
        {themeButton}
      </header>

      <nav className="nav" aria-label="Điều hướng">
        <span className="wordmark">ToDoLife</span>
        <div className="nav-items">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              className={`nav-item${view === v.id ? ' active' : ''}`}
              onClick={() => changeView(v.id)}
              aria-current={view === v.id ? 'page' : undefined}
            >
              <Icon name={v.icon} size={21} />
              <span>{v.name}</span>
            </button>
          ))}
        </div>
        <button className="add" onClick={() => openAdd(view === 'upcoming' ? '' : today)}>
          <Icon name="plus" size={20} strokeWidth={2.6} />
          <span>Thêm việc</span>
        </button>
        <div className="nav-foot">{themeButton}</div>
      </nav>

      <main className={`main view-${view}`}>
        <ViewComponent tasks={tasks} routines={routines} today={today} now={now} actions={actions} />
        <InstallBanner />
      </main>

      {sheet && (
        <TaskSheet
          task={sheet.task}
          routine={sheet.routine}
          defaults={sheet.defaults}
          onClose={() => setSheet(null)}
          onSave={saveTask}
          onDelete={deleteTask}
          onDeleteRoutine={deleteRoutine}
        />
      )}

      {toast && (
        <div className="toast" key={toast.id} role="status">
          <span>{toast.message}</span>
          {toast.undo && (
            <button
              onClick={() => {
                toast.undo()
                setToast(null)
              }}
            >
              Hoàn tác
            </button>
          )}
        </div>
      )}
    </div>
  )
}
