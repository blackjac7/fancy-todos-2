const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.use(authenticate);

router.get('/', TodoController.todoUser);

router.get('/finished', TodoController.todoUserFinished);

router.post('/', TodoController.createTodoUser);

router.get('/:id', TodoController.todoById);

router.put('/:id', authorize, TodoController.updateTodoUser);

router.patch('/:id', authorize, TodoController.updateStatusTodoUser);

router.delete('/:id', authorize, TodoController.deleteTodoUser);


module.exports = router;