import { useState, useEffect } from 'react';

const PRIORITIES = ['low', 'medium', 'high'];

const TaskModal = ({ task, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        priority: task.priority || 'medium',
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md border-slate-700 shadow-2xl shadow-blue-950/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Title *</label>
            <input className="input" value={form.title} onChange={set('title')} placeholder="What needs doing?" autoFocus />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="Any extra context... (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Due Date</label>
              <input type="date" className="input" value={form.due_date} onChange={set('due_date')} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Priority</label>
              <select className="input" value={form.priority} onChange={set('priority')}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving…' : task ? 'Update Task' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
