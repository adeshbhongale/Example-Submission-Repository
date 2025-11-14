import {
  Routes, Route, Link
} from 'react-router-dom'
import React, { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotify, useClear } from './context/NotificationContext'
import { useUserValue, useUserDispatch } from './context/UserContext'

const App = () => {
  const user = useUserValue()
  const dispatch = useUserDispatch()
  const queryClient = useQueryClient()
  const notify = useNotify()
  const clear = useClear()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'LOGIN', payload: user })
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const blogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    enabled: !!user,
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'success')
      setTimeout(() => clear(), 5000)
      blogFormRef.current.toggleVisibility()
    },
    onError: () => {
      notify('Error creating blog', 'error')
      setTimeout(() => clear(), 5000)
    }
  })

  const blogFormRef = useRef()

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatch({ type: 'LOGIN', payload: user })
      blogService.setToken(user.token)
      notify(`${user.name} logged in`, 'success')
      setTimeout(() => clear(), 5000)
    } catch (exception) {
      notify('wrong username or password', 'error')
      setTimeout(() => clear(), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch({ type: 'LOGOUT' })
    notify('logged out', 'error')
    setTimeout(() => clear(), 5000)
  }

  const addBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  const blogs = blogsResult.isSuccess ? blogsResult.data : []

  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        <span style={padding}>{user.name} logged in</span>
        <button onClick={handleLogout}>logout</button>
      </div>

      <h2>blog app</h2>
      <Notification />

      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/" element={
          <div>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
            {blogsResult.isLoading ? (
              <div>Loading blogs...</div>
            ) : blogsResult.isError ? (
              <div>Error loading blogs</div>
            ) : (
              blogs
                .slice()
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .map(blog => (
                  <Blog
                    key={blog.id}
                    blog={blog}
                    currentUser={user}
                  />
                ))
            )}
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
