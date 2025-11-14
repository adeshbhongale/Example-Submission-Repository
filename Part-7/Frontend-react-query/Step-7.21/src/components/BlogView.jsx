import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'

const BlogView = () => {
  const id = useParams().id
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    select: (blogs) => blogs.find(blog => blog.id === id),
  })

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, newObject }) => blogService.update(id, newObject),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    }
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: (updatedBlog) => {
        const blogs = queryClient.getQueryData(['blogs'])
        queryClient.setQueryData(['blogs'], blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      navigate('/')
    },
  })

  const handleLike = () => {
    const blogToUpdate = result.data
    updateBlogMutation.mutate({ id: blogToUpdate.id, newObject: { ...blogToUpdate, likes: blogToUpdate.likes + 1 } })
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    addCommentMutation.mutate({ id: blog.id, comment })
    setComment('')
  }
  
  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        removeBlogMutation.mutate(blog.id)
    }
  }

  if (result.isLoading) {
    return <div>loading...</div>
  }

  const blog = result.data

  if (!blog) {
    return <div>blog not found</div>
  }

  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  const user = loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  const canRemove = user && blog.user && user.username === blog.user.username

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      {blog.user && <div>added by {blog.user.name}</div>}
      
      {canRemove && (
        <button onClick={handleRemove} style={{ background: 'red', color: 'white' }}>remove</button>
      )}

      <h3>comments</h3>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments && blog.comments.map((comment, index) => 
          <li key={index}>{comment}</li>
        )}
      </ul>
    </div>
  )
}

export default BlogView
