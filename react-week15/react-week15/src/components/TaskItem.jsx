export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-3 py-4">
      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 py-2">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)}
          className="h-5 w-5 shrink-0 accent-teal-700" />
        <span className={`min-w-0 [overflow-wrap:anywhere] ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
          {task.title}
        </span>
      </label>
      <button type="button" onClick={() => onDelete(task.id)} aria-label={`${task.title}を削除`}
        className="shrink-0 rounded-lg px-3 py-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-700">削除</button>
    </li>
  )
}
