const pool = require('../config/db');

const getTasks = (userId, { status, priority, search, sort, page = 1, limit = 20 }) => {
  const conditions = ['user_id = $1'];
  const values = [userId];
  let idx = 2;

  if (status === 'active') { conditions.push(`completed = false`); }
  else if (status === 'completed') { conditions.push(`completed = true`); }

  if (priority) { conditions.push(`priority = $${idx++}`); values.push(priority); }

  if (search) {
    conditions.push(`title ILIKE $${idx++}`);
    values.push(`%${search}%`);
  }

  const sortMap = {
    due_date: 'due_date ASC NULLS LAST',
    priority: "CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END",
    created: 'created_at DESC',
  };
  const orderBy = sortMap[sort] || 'created_at DESC';

  const offset = (page - 1) * limit;
  values.push(limit, offset);

  const query = `
    SELECT * FROM tasks
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${orderBy}
    LIMIT $${idx++} OFFSET $${idx}
  `;

  return pool.query(query, values);
};

const countTasks = (userId, { status, priority, search }) => {
  const conditions = ['user_id = $1'];
  const values = [userId];
  let idx = 2;

  if (status === 'active') conditions.push(`completed = false`);
  else if (status === 'completed') conditions.push(`completed = true`);
  if (priority) { conditions.push(`priority = $${idx++}`); values.push(priority); }
  if (search) { conditions.push(`title ILIKE $${idx++}`); values.push(`%${search}%`); }

  return pool.query(`SELECT COUNT(*) FROM tasks WHERE ${conditions.join(' AND ')}`, values);
};

const getTaskById = (id, userId) =>
  pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);

const createTask = (userId, { title, description, due_date, priority }) =>
  pool.query(
    `INSERT INTO tasks (user_id, title, description, due_date, priority)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, title, description || null, due_date || null, priority || 'medium']
  );

const updateTask = (id, userId, fields) => {
  const allowed = ['title', 'description', 'due_date', 'priority', 'completed'];
  const updates = [];
  const values = [];
  let idx = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = $${idx++}`);
      values.push(fields[key]);
    }
  }

  if (!updates.length) return Promise.resolve({ rows: [] });

  updates.push(`updated_at = NOW()`);
  values.push(id, userId);

  return pool.query(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
    values
  );
};

const deleteTask = (id, userId) =>
  pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);

module.exports = { getTasks, countTasks, getTaskById, createTask, updateTask, deleteTask };
