const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const todoRouter = require('./todos');

router.use('/users', userRouter)

router.use('/todos', todoRouter)


module.exports = router;
