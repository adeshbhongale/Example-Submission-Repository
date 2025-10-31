import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onLike, onRemove, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      user: blog.user && blog.user.id ? blog.user.id : blog.user
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    // Patch: ensure user field is full object for immediate UI update
    if (typeof blog.user === 'object') {
      returnedBlog.user = blog.user
    }
    if (onLike) {
      onLike(returnedBlog)
    }
  }

  const canRemove = currentUser && blog.user && (blog.user.username === currentUser.username)

  return (
    <div style={blogStyle}>
      <div className="blog-summary">
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div className="blog-details">
          <div>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
          </div>
          <div>likes {blog.likes || 0} <button onClick={handleLike}>like</button></div>
          <div>{blog.user && blog.user.name ? blog.user.name : ''}</div>
          {canRemove && (
            <button onClick={() => onRemove(blog)} style={{ background: 'red', color: 'white' }}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog