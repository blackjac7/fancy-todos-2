const errorhandler = (err, req, res, next) => {
  if (err.name === "SequelizeUniqueConstraintError" || err.name === "SequelizeValidationError"){
    const errors = err.errors.map(el => {
      return el.message;
    })
    res.status(400).json(errors);
  }else if (err.name === "customError"){
    res.status(err.status).json({ message: err.msg })
  }else {
    const error = err || "Internal server error";
    res.status(500).json(error);
  }
};


module.exports = errorhandler;