const { Todo } = require('../models/index');

class TodoController {
  static todoUser(req, res, next){
    let options = {
      where: {
        user_id: req.decoded.id,
        status: false
      },
      order: [["due_date", "DESC"]]
    }
    
    Todo.findAll(options)
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(err => {
        next(err);
      })
  }

  static todoUserFinished(req, res, next){
    let options = {
      where: {
        user_id: req.decoded.id,
        status: true
      },
      order: [["due_date", "DESC"]]
    }
    
    Todo.findAll(options)
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(err => {
        next(err);
      })
  }

  static createTodoUser(req, res, next){
    let obj = {
      title: req.body.title,
      description: req.body.description,
      status: false,
      due_date: req.body.due_date,
      user_id: req.decoded.id
    }

    Todo.create(obj)
      .then(todo => {
        console.log(todo)
        res.status(201).json(todo);
      })
      .catch(err => {
        next(err)
      })
  }

  static todoById(req, res, next){
    let id = +req.params.id;

    Todo.findByPk(id)
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(err => {
        next(err);
      })
  }

  static updateTodoUser(req, res, next){
    let obj = {
      title: req.body.title,
      description: req.body.description,
      due_date: req.body.due_date,
    }
    let options = {
      where: {
        id: +req.params.id
      },
      returning: true
    }

    Todo.update(obj, options)
      .then(todo => {
        res.status(200).json(todo[1][0])
      })
      .catch(err => {
        next(err)
      })
  }

  static updateStatusTodoUser(req, res, next){
    let obj = {
      status: true
    }
    let options = {
      where: {
        id: +req.params.id
      },
      returning: true
    }

    Todo.update(obj, options)
      .then(todo => {
        res.status(200).json(todo[1][0])
      })
      .catch(err => {
        next(err)
      })
  }

  static deleteTodoUser(req, res, next){
    const id = +req.params.id

    Todo.destroy({
      where: {
        id
      }
    })
      .then(todo => {
        res.status(200).json({ msg: "Delete Success" });
      })
      .catch(err => {
        next(err);
      })
  }
}

module.exports = TodoController;