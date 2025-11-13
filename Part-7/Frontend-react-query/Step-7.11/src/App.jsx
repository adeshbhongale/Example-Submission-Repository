import React, { useState, useEffect, useReducer, createContext, useContext } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

// Notification context and reducer
const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)


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
      notificationDispatch({ type: 'SET', payload: `${user.username} logged in` })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
    } catch (exception) {
      notificationDispatch({ type: 'SET', payload: 'wrong username or password' })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
    notificationDispatch({ type: 'SET', payload: { message: 'logged out', type: 'error' } })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  const blogFormRef = React.useRef()

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notificationDispatch({ type: 'SET', payload: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added` })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
      blogFormRef.current.toggleVisibility()
      return true
    } catch (exception) {
      notificationDispatch({ type: 'SET', payload: 'Error creating blog' })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
      return false
    }
  }

  if (user === null) {
    return (
      <NotificationContext.Provider value={{ notification, notificationDispatch }}>
        <div>
          <h2>Log in to application</h2>
          <Notification message={notification && (notification.message || notification)} type={notification && notification.type} />
          <LoginForm handleLogin={handleLogin} />
        </div>
      </NotificationContext.Provider>
    )
  }

  return (
    <NotificationContext.Provider value={{ notification, notificationDispatch }}>
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
              onLike={updatedBlog => {
                setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
              }}
              onRemove={async (blogToRemove) => {
                if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`)) {
                  try {
                    await blogService.remove(blogToRemove.id)
                    setBlogs(blogs.filter(b => b.id !== blogToRemove.id))
                    notificationDispatch({ type: 'SET', payload: `Blog '${blogToRemove.title}' removed` })
                    setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
                  } catch (error) {
                    notificationDispatch({ type: 'SET', payload: 'Error removing blog' })
                    setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
                  }
                }
              }}
            />
          )}
      </div>
    </NotificationContext.Provider>
  )
}

export default App