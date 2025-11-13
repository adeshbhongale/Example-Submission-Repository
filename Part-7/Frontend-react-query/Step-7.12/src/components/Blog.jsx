import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotify, useClear } from '../context/NotificationContext'

const Blog = ({ blog, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false)
  const queryClient = useQueryClient()
  const notify = useNotify()
  const clear = useClear()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, ...updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map(b => (b.id === updatedBlog.id ? { ...b, ...updatedBlog } : b))
      )
    },
    onError: () => {
      notify('Error liking blog', 'error')
      setTimeout(() => clear(), 5000)
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, blogId) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter(b => b.id !== blogId)
      )
      notify('Blog removed', 'success')
      setTimeout(() => clear(), 5000)
    },
    onError: () => {
      notify('Error removing blog', 'error')
      setTimeout(() => clear(), 5000)
    },
  })

  const handleLike = () => {
    const { id, likes, user, ...rest } = blog
    updateBlogMutation.mutate({ ...rest, id, likes: (likes || 0) + 1, userId: user.id })
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id)
    }
  }

  const canRemove = blog.user && blog.user.username === currentUser.username

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'hide' : 'view'}
      </button>
      {showDetails && (
        <div id="blog-details">
          <div>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </div>
          <div data-cy="likes-section">
            likes {blog.likes}
            <button data-cy="like-button" id="like" onClick={handleLike}>
              like
            </button>
          </div>
          <div>{blog.user && blog.user.name ? blog.user.name : ''}</div>
          {canRemove && (
            <button onClick={handleRemove} style={{ background: 'red', color: 'white' }}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
