const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({ username: 'root', name: 'Superuser', passwordHash: 'hashedpassword' })
  await user.save()
})

describe('when creating a new user', () => {
  test('creation succeeds with a fresh username and valid password', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'secret123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status and message if username already taken', async () => {
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'secret123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')
  })

  test('creation fails if username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'secret123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('username must be at least 3 characters long')
  })

  test('creation fails if username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'secret123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('username must be at least 3 characters long')
  })

  test('creation fails if password is missing', async () => {
    const newUser = {
      username: 'nopassword',
      name: 'No Password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('password must be at least 3 characters long')
  })

  test('creation fails if password is too short', async () => {
    const newUser = {
      username: 'shortpass',
      name: 'Short Password',
      password: 'pw',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('password must be at least 3 characters long')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
