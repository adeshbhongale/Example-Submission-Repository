process.env.NODE_ENV = 'test'
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { test, before, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')


const api = supertest(app)
const User = require('../models/user')

let token = null;

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

before(async () => {
  await User.deleteMany({})
  const newUser = { username: 'testuser', name: 'Test User', password: 'testpass' }
  await api.post('/api/users').send(newUser)
  const loginResponse = await api.post('/api/login').send({ username: 'testuser', password: 'testpass' })
  token = loginResponse.body.token
});

after(async () => {
  await mongoose.connection.close();
});

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

test('a valid blog can be added with a valid token', async (t) => {
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
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 201)
  assert.match(response.headers['content-type'], /application\/json/)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1)

  const titles = blogsAtEnd.body.map(b => b.title)
  assert.ok(titles.includes(newBlog.title))
})

test('adding a blog fails with 401 if token is not provided', async (t) => {
  const newBlog = {
    title: 'Unauthorized blog',
    author: 'No Token',
    url: 'http://example.com/unauth',
    likes: 0
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 401)
  assert.ok(response.body.error.includes('token missing or invalid'))
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
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 201)
  assert.match(response.headers['content-type'], /application\/json/)
  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async (t) => {
  const newBlog = {
    author: 'No Title Author',
    url: 'http://example.com/notitle',
    likes: 1
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 400)
})

test('blog without url is not added', async (t) => {
  const newBlog = {
    title: 'No URL Blog',
    author: 'No URL Author',
    likes: 1
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 400)
})

test('a blog can be deleted', async (t) => {
  // Add a blog to delete
  const newBlog = {
    title: 'Blog to be deleted',
    author: 'Delete Author',
    url: 'http://example.com/delete',
    likes: 0
  }
  const postResponse = await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
  assert.strictEqual(postResponse.status, 201)
  const blogToDelete = postResponse.body

  // Delete the blog
  const deleteResponse = await api.delete(`/api/blogs/${blogToDelete.id}`)
  assert.strictEqual(deleteResponse.status, 204)

  // Check that the blog is gone
  const blogsAtEnd = await api.get('/api/blogs')
  const ids = blogsAtEnd.body.map(b => b.id)
  assert.ok(!ids.includes(blogToDelete.id))
})

test('a blog can be updated', async (t) => {
  // Add a blog to update
  const newBlog = {
    title: 'Blog to update',
    author: 'Update Author',
    url: 'http://example.com/update',
    likes: 1
  }
  const postResponse = await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
  assert.strictEqual(postResponse.status, 201)
  const blogToUpdate = postResponse.body

  // Update the blog's likes
  const updatedData = { ...blogToUpdate, likes: 42 }
  const updateResponse = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedData).set('Accept', 'application/json')
  assert.strictEqual(updateResponse.status, 200)
  assert.strictEqual(updateResponse.body.likes, 42)

  // Confirm in DB
  const getResponse = await api.get(`/api/blogs`)
  const updatedBlog = getResponse.body.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, 42)
  })