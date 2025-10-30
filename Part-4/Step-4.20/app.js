const express = require('express')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' })
} else {
  dotenv.config()
}




const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { tokenExtractor } = require('./middleware/tokenExtractor')

const app = express()

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error.message))


app.use(express.json())
app.use(tokenExtractor)


app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app