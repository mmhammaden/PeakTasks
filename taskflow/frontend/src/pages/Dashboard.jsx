import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskFilters from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';
import TaskListSkeleton from '../components/TaskListSkeleton';
import toast from 'react-hot-toast';

const LIMIT = 10;

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, total, loading, fetchTasks, addTask, editTask, removeTask, toggleComplete } = useTasks();

  const [filters, setFilters] = useState({ status: '', priority: '', search: '', sort: '', page: 1 });
  const [modal, setModal] = useState({ open: false, task: null });

  // debounce so we're not hammering the db on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      console.log('📡 fetching tasks with filters:', filters, '— yes, every 300ms, deal with it');
      fetchTasks({ ...filters, limit: LIMIT });
    }, 300);
    return () => clearTimeout(t);
  }, [filters, fetchTasks]);

  const handleSave = async (formData) => {
    if (modal.task) {
      await editTask(modal.task.id, formData);
    } else {
      await addTask(formData);
    }
    fetchTasks({ ...filters, limit: LIMIT });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task? No take-backs.')) return;
    try {
      await removeTask(id);
      fetchTasks({ ...filters, limit: LIMIT });
    } catch {
      toast.error('Failed to delete — the task is fighting back');
    }
  };

  const handleToggle = async (task) => {
    try {
      await toggleComplete(task);
      if (!task.completed) console.log(`✅ "${task.title}" marked done. Treat yourself.`);
      fetchTasks({ ...filters, limit: LIMIT });
    } catch {
      toast.error('Toggle failed, try again');
    }
  };

  const totalPages = Math.ceil(total / LIMIT);
  const isFiltered = !!(filters.status || filters.priority || filters.search);
  const overdueCount = tasks.filter(
    (t) => t.due_date && !t.completed && new Date(t.due_date) < new Date(new Date().toDateString())
  ).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Good {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {total} task{total !== 1 ? 's' : ''} total
            {overdueCount > 0 && (
              <span className="text-red-400 ml-2">· {overdueCount} overdue</span>
            )}
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, task: null })}
          className="btn-primary flex items-center gap-2"
        >
          <span className="text-lg leading-none font-light">+</span> New Task
        </button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total',     value: total,                                    color: 'text-[#4477ff]' },
          { label: 'Completed', value: tasks.filter((t) => t.completed).length,  color: 'text-emerald-400' },
          { label: 'Overdue',   value: overdueCount,                             color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center py-3 hover:border-slate-700 transition-colors">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="mb-4">
        <TaskFilters filters={filters} onChange={setFilters} />
      </div>

      {/* task list — skeleton while loading, empty state if nothing, cards otherwise */}
      {loading ? (
        <TaskListSkeleton count={5} />
      ) : tasks.length === 0 ? (
        <EmptyState filtered={isFiltered} />
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => setModal({ open: true, task: t })}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-40"
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-400">
            Page {filters.page} of {totalPages}
          </span>
          <button
            className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-40"
            disabled={filters.page >= totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
          >
            Next →
          </button>
        </div>
      )}

      {modal.open && (
        <TaskModal
          task={modal.task}
          onSave={handleSave}
          onClose={() => setModal({ open: false, task: null })}
        />
      )}
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

export default Dashboard;
