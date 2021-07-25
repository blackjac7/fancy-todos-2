const { Todo } = require('../models/index');

const authorize = (req, res, next) => { 
  const idTodo = +req.params.id
  
  Todo.findByPk(idTodo)
    .then(todo => {
      if(!todo) throw { name: "customError", msg: "Data not found", status: 404 };
      
      if (todo.user_id === req.decoded.id){
        next();
      }else {
        throw { name: "customError", msg: "Not authorized", status: 401 };
      }
    })
    .catch(err => {
      next(err);
    })
}

module.exports = authorize