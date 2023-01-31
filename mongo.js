const mongoose = require('mongoose')
const { config } = require('./utils/config')

const url = config.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url).then((res) => {
  console.log('connected to mongodb successfully')
}).catch((error) => {
  console.log('error occured while connecting to mongodb', error)
})


