const { json } = require('body-parser')
const mongoose = require('mongoose')
const { config } = require('./utils/config')

// const password = "farre8085"

const url = config.MONGODB_URI
// const url =
//   `mongodb+srv://farre:${password}@cluster0.1ddgdps.mongodb.net/farre?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url).then((res) => {
  console.log('connected to mongodb successfully')
}).catch((error) => {
  console.log('erorr occured while connecting to mongodb', erorr)
})

const noteSchema = new mongoose.Schema({
  content: String,
  isImportant: Boolean,
  isCompleted: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema);