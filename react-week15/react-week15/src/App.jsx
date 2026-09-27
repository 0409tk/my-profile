import { useEffect, useState } from 'react'
import TaskItem from './components/TaskItem'

const STORAGE_KEY = 'week15-tasks'
const filters = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
]

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(saved)) return []
    const ids = new Set()
    return saved.filter((task) => {
      if (!task || typeof task.id !== 'string' || ids.has(task.id) ||
        typeof task.title !== 'string' || !task.title.trim() ||
        typeof task.completed !== 'boolean') return false
      ids.add(task.id)
      return true
    })
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const [storageError, setStorageError] = useState('')

  useEffect(() => {
    let message = ''
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      message = '保存できませんでした。再読み込みすると変更が失われる可能性があります。'
    }
    setStorageError(message)
  }, [tasks])

  function addTask(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    setTasks((previous) => [
      ...previous,
      { id: crypto.randomUUID(), title: trimmedTitle, completed: false },
    ])
    setTitle('')
  }

  function toggleTask(id) {
    setTasks((previous) => previous.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ))
  }

  function deleteTask(id) {
    setTasks((previous) => previous.filter((task) => task.id !== id))
  }

  const remaining = tasks.filter((task) => !task.completed).length
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-20">
      <header className="mb-8">
        <p className="mb-3 text-sm font-bold tracking-widest text-teal-700">MY TASKS</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">今日のやること</h1>
      </header>
      <section aria-label="タスク管理" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <form onSubmit={addTask} className="mb-8">
          <label htmlFor="task-title" className="mb-2 block text-sm font-semibold">新しいタスク</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)}
              placeholder="例：React の課題を進める" maxLength={200}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 placeholder:text-slate-400" />
            <button type="submit" disabled={!title.trim()}
              className="rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40">追加する</button>
          </div>
        </form>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div role="group" aria-label="タスクの絞り込み" className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {filters.map((item) => (
              <button key={item.value} type="button" aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${filter === item.value ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>
                {item.label}
              </button>
            ))}
          </div>
          <p role="status" className="text-sm text-slate-500">残り <span className="font-bold text-teal-700">{remaining}</span> / {tasks.length} 件</p>
        </div>
        {visibleTasks.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {visibleTasks.map((task) => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)}
          </ul>
        ) : (
          <p className="py-12 text-center leading-7 text-slate-500">
            {tasks.length === 0 ? 'タスクはまだありません。最初のひとつを追加しましょう。' : 'この条件のタスクはありません。'}
          </p>
        )}
      </section>
      {storageError && <p role="alert" className="mt-3 text-sm text-red-700">{storageError}</p>}
    </main>
  )
}
export default App
