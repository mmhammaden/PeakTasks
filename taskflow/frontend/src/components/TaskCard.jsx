import PomodoroTimer from './PomodoroTimer';

const PRIORITY_STYLES = {
  high:   'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low:    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const isOverdue = (due_date, completed) => {
  if (!due_date || completed) return false;
  return new Date(due_date) < new Date(new Date().toDateString());
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const overdue = isOverdue(task.due_date, task.completed);

  return (
    <div
      className={`card flex gap-3 group transition-all duration-200 hover:border-slate-600 hover:shadow-lg hover:shadow-blue-950/40 ${
        task.completed ? 'opacity-55' : ''
      } ${overdue ? 'border-red-900/50' : ''}`}
    >
      {/* complete toggle */}
      <button
        onClick={() => onToggle(task)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-[#003399] border-[#003399] shadow-sm shadow-blue-700/50'
            : 'border-slate-600 hover:border-[#003399]'
        }`}
      >
        {task.completed && <span className="text-white text-xs leading-none">✓</span>}
      </button>

      {/* main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-medium truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
            {task.title}
          </h3>

          {/* action buttons — only show on hover */}
          <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* pomodoro — the whole reason i built this feature tbh */}
            <PomodoroTimer taskId={task.id} taskTitle={task.title} />

            <button
              onClick={() => onEdit(task)}
              className="text-slate-500 hover:text-[#4477ff] p-1 rounded transition-colors"
              title="Edit task"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
              title="Delete task"
            >
              🗑️
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
            {task.priority}
          </span>

          {task.due_date && (
            <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-400 font-medium' : 'text-slate-500'}`}>
              {overdue ? '⚠️' : '📅'} {formatDate(task.due_date)}
              {overdue && ' · Overdue'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
