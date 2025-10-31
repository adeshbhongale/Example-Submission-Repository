
import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          <div><a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></div>
          <div>likes {blog.likes || 0} <button>like</button></div>
          <div>{blog.user && blog.user.name ? blog.user.name : ''}</div>
        </div>
      )}
    </div>
  )
}

export default Blog