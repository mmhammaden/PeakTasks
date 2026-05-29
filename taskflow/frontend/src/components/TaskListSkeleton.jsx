// skeleton cards — way better than a spinning circle, honestly
const TaskSkeleton = () => (
  <div className="card flex gap-3 animate-pulse">
    <div className="skeleton w-5 h-5 rounded-full mt-0.5 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-4 w-14 rounded-full" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>
    </div>
  </div>
);

const TaskListSkeleton = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <TaskSkeleton key={i} />
    ))}
  </div>
);

export default TaskListSkeleton;
