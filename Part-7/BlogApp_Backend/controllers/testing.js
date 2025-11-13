const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Testing = require('../models/testing')
const dotenv = require('dotenv')
dotenv.config();

testingRouter.post('/reset', async (request, response) => {
  if (process.env.NODE_ENV !== 'test') {
    return response.status(403).json({ error: 'reset allowed only in test environment' })
  }

  await Blog.deleteMany({})
  await User.deleteMany({})

  // Log the reset action
  await Testing.create({ action: 'reset', details: { by: 'api', ip: request.ip } })

  response.status(204).end()
})

module.exports = testingRouter
