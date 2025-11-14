import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const Blog = ({ blog, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false)
  const queryClient = useQueryClient()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, newObject }) => blogService.update(id, newObject),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data, removedId) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.filter(b => b.id !== removedId))
    }
  })

  const handleLike = () => {
    updateBlogMutation.mutate({ id: blog.id, newObject: { ...blog, likes: blog.likes + 1 } })
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlogMutation.mutate(blog.id)
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
          <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
          <div>{blog.user && blog.user.name ? blog.user.name : ''}</div>
          {canRemove && (
            <button onClick={handleRemove} style={{ background: 'red', color: 'white' }}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
