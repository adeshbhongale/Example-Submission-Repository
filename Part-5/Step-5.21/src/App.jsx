import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])


  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setNotification(`${user.username} logged in`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification('wrong username or password')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
    setNotification({ message: 'logged out', type: 'error' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const blogFormRef = React.useRef()

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      blogFormRef.current.toggleVisibility()
      return true
    } catch (exception) {
      setNotification('Error creating blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return false
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification && (notification.message || notification)} type={notification && notification.type} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification && (notification.message || notification)} type={notification && notification.type} />
      <div>
        {user.username} logged in <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs
        .slice()
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            currentUser={user}
            onLike={async blogToLike => {
              const updatedBlog = {
                ...blogToLike,
                likes: (blogToLike.likes || 0) + 1,
                user: blogToLike.user.id || blogToLike.user // ensure user is id for backend
              }
              const returnedBlog = await blogService.update(blogToLike.id, updatedBlog)
              setBlogs(blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b))
            }}
            onRemove={async (blogToRemove) => {
              if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`)) {
                try {
                  await blogService.remove(blogToRemove.id)
                  setBlogs(blogs.filter(b => b.id !== blogToRemove.id))
                  setNotification(`Blog '${blogToRemove.title}' removed`)
                  setTimeout(() => setNotification(null), 5000)
                } catch (error) {
                  setNotification('Error removing blog')
                  setTimeout(() => setNotification(null), 5000)
                }
              }
            }}
          />
        )}
    </div>
  )
}

export default App