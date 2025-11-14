import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { useUserValue } from '../context/UserContext'

const BlogView = () => {
  const id = useParams().id
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const user = useUserValue()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    select: (blogs) => blogs.find(blog => blog.id === id)
  })

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, newObject }) => blogService.update(id, newObject),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      if (blogs) {
        queryClient.setQueryData(['blogs'], blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
      } else {
        queryClient.invalidateQueries(['blogs'])
      }
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      navigate('/')
    }
  })

  const handleLike = () => {
    const blogToUpdate = result.data
    updateBlogMutation.mutate({ id: blogToUpdate.id, newObject: { ...blogToUpdate, likes: blogToUpdate.likes + 1 } })
  }

  const handleRemove = () => {
    const blogToRemove = result.data
    if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`)) {
      removeBlogMutation.mutate(blogToRemove.id)
    }
  }

  if (result.isLoading) {
    return <div>loading...</div>
  }

  const blog = result.data

  if (!blog) {
    return <div>blog not found</div>
  }

  const canRemove = user && blog.user && user.username === blog.user.username

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      {blog.user && <div>added by {blog.user.name}</div>}
      {canRemove && <button onClick={handleRemove} style={{ background: 'red', color: 'white' }}>remove</button>}
    </div>
  )
}

export default BlogView
