const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = 'mongodb+srv://adeshbhongale03:Password@cluster1.xsnemxy.mongodb.net/BlogsApp?retryWrites=true&w=majority&appName=Cluster1'
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error.message))

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app