const { getTasks, countTasks, getTaskById, createTask, updateTask, deleteTask } = require('../queries/tasks');

exports.listTasks = async (req, res) => {
  const { status, priority, search, sort, page = 1, limit = 20 } = req.query;
  const filters = { status, priority, search, sort, page: parseInt(page), limit: parseInt(limit) };

  try {
    const [tasksResult, countResult] = await Promise.all([
      getTasks(req.user.id, filters),
      countTasks(req.user.id, filters),
    ]);

    res.json({
      tasks: tasksResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: filters.page,
      limit: filters.limit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, due_date, priority } = req.body;

  if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

  try {
    const result = await createTask(req.user.id, { title: title.trim(), description, due_date, priority });
    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await updateTask(id, req.user.id, req.body);
    if (!result.rows.length) return res.status(404).json({ message: 'Task not found' });
    res.json({ task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteTask(id, req.user.id);
    if (!result.rows.length) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTask = async (req, res) => {
  try {
    const result = await getTaskById(req.params.id, req.user.id);
    if (!result.rows.length) return res.status(404).json({ message: 'Task not found' });
    res.json({ task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
