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

  const handleLike = (e) => {
    e.preventDefault()
    if (onLike) {
      onLike(blog)
    }
  }


  const canRemove = currentUser && blog.user && (blog.user.username === currentUser.username)

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'hide' : 'view'}
      </button>
      {showDetails && (
        <div id="blog-details">
          <div>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
          </div>
          <div data-cy="likes-section">likes {blog.likes}</div>
          <button data-cy="like-button" id="like" onClick={handleLike}>like</button>
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