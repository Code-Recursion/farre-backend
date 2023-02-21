require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.TEST_MONGODB_URI
if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.MONGODB_URI
}
console.log('URL', MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT
}
