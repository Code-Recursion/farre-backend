require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')

const cors = require("cors");
const { MONGODB_URI } = require("./utils/config");
app.use(cors());

const mongoose = require('mongoose')

const url = MONGODB_URI;
console.log('mongourl', url)
mongoose.set('strictQuery', false)
mongoose.connect(url).then((res) => {
  console.log('connected to mongodb successfully')
}).catch((error) => {
  console.log('error occured while connecting to mongodb', error)
})

app.use(middleware.requestLogger);

app.get('/', (req, res, next) => {
  res.send('<h1>Server is healthy! 💪<h1/>')
})

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);

app.use(middleware.errorHandler)

module.exports = app