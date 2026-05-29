import { useState, useCallback } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks', { params: filters });
      setTasks(data.tasks);
      setTotal(data.total);
      console.log(`📦 loaded ${data.tasks.length} of ${data.total} tasks — the database is cooperating today`);
    } catch {
      console.error('💥 fetchTasks blew up — is the backend running? is postgres running? is anything running?');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    console.log(`➕ task created: "${data.task.title}" — you've got ${data.task.priority} priority taste`);
    toast.success('Task created!');
    return data.task;
  };

  const editTask = async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    console.log(`✏️ task ${id} updated — changed your mind again, huh`);
    toast.success('Task updated!');
    return data.task;
  };

  const removeTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    console.log(`🗑️ task ${id} deleted — gone. not coming back. closure.`);
    toast.success('Task deleted');
  };

  const toggleComplete = async (task) => {
    const { data } = await api.put(`/tasks/${task.id}`, { completed: !task.completed });
    return data.task;
  };

  return { tasks, total, loading, fetchTasks, addTask, editTask, removeTask, toggleComplete };
};
