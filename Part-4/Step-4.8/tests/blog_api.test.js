process.env.NODE_ENV = 'test'
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author One',
    url: 'http://example.com/1',
    likes: 1
  },
  {
    title: 'Second blog',
    author: 'Author Two',
    url: 'http://example.com/2',
    likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json and correct amount', async (t) => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.status, 200)
  assert.match(response.headers['content-type'], /application\/json/)
  assert.strictEqual(response.body.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
