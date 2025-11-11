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


  const canRemove =
    currentUser &&
    blog.user &&
    (
      (typeof blog.user === 'object' && blog.user.username === currentUser.username) ||
      (typeof blog.user === 'string' && (blog.user === currentUser.id || blog.user === currentUser._id))
    )

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
          <div data-cy="likes-section">likes {blog.likes}</div>
          <button data-cy="like-button" id="like" onClick={handleLike}>like</button>
          <div>{blog.user && blog.user.name ? blog.user.name : ''}</div>
          <div className="blog">
          {canRemove && (
            <button  onClick={() => onRemove(blog)} style={{ background: 'red', color: 'white' }}>remove</button>
          )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog