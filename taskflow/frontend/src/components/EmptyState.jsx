const EmptyState = ({ filtered }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-6xl mb-4">{filtered ? '🔍' : '📋'}</div>
    <h3 className="text-lg font-semibold text-slate-300 mb-1">
      {filtered ? 'No tasks match your filters' : 'No tasks yet'}
    </h3>
    <p className="text-slate-500 text-sm">
      {filtered
        ? 'Try adjusting your search or filters.'
        : "Nothing here yet. Add a task — I believe in you."}
    </p>
  </div>
);

export default EmptyState;
