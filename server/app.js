if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = 3000;

//cors
app.use(cors());

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use(routes);

//error handler
app.use(errorHandler);

//listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));