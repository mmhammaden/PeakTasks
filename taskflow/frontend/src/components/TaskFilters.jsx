const STATUS_TABS = ['all', 'active', 'completed'];
const PRIORITIES = ['', 'high', 'medium', 'low'];
const SORTS = [
  { value: '', label: 'Newest' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'created', label: 'Created' },
];

const TaskFilters = ({ filters, onChange }) => {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value, page: 1 });
  const setStatus = (status) => onChange({ ...filters, status, page: 1 });

  return (
    <div className="space-y-3">
      <input
        className="input"
        placeholder="🔍  Search tasks…"
        value={filters.search || ''}
        onChange={set('search')}
      />

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s === 'all' ? '' : s)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                (filters.status || '') === (s === 'all' ? '' : s)
                  ? 'bg-[#003399] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select className="input w-auto text-sm py-1.5" value={filters.priority || ''} onChange={set('priority')}>
            <option value="">All Priorities</option>
            {PRIORITIES.filter(Boolean).map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>

          <select className="input w-auto text-sm py-1.5" value={filters.sort || ''} onChange={set('sort')}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
