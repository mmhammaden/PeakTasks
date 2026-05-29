const router = require('express').Router();
const { listTasks, createTask, updateTask, deleteTask, getTask } = require('../controllers/taskController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', listTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
