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

test('unique identifier property of blog posts is named id', async (t) => {
  const response = await api.get('/api/blogs')
  assert.ok(Array.isArray(response.body))
  for (const blog of response.body) {
    assert.ok(blog.id, 'Blog should have an id property')
    assert.strictEqual(blog._id, undefined, 'Blog should not have _id property')
  }
})

test('a valid blog can be added', async (t) => {
  const newBlog = {
    title: 'New blog post',
    author: 'Test Author',
    url: 'http://example.com/new',
    likes: 5
  }

  const blogsAtStart = await api.get('/api/blogs')

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 201)
  assert.match(response.headers['content-type'], /application\/json/)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1)

  const titles = blogsAtEnd.body.map(b => b.title)
  assert.ok(titles.includes(newBlog.title))
})

test('if likes property is missing, it defaults to 0', async (t) => {
  const newBlog = {
    title: 'Blog with no likes',
    author: 'No Likes Author',
    url: 'http://example.com/nolikes'
    // likes is intentionally missing
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 201)
  assert.match(response.headers['content-type'], /application\/json/)
  assert.strictEqual(response.body.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})
