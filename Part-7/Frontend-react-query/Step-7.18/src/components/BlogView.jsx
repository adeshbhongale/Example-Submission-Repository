import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'

const BlogView = () => {
  const id = useParams().id
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

  const handleLike = () => {
    const blogToUpdate = result.data
    updateBlogMutation.mutate({ id: blogToUpdate.id, newObject: { ...blogToUpdate, likes: blogToUpdate.likes + 1 } })
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    addCommentMutation.mutate({ id: blog.id, comment })
    setComment('')
  }

  if (result.isLoading) {
    return <div>loading...</div>
  }

  const blog = result.data

  if (!blog) {
    return <div>blog not found</div>
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      {blog.user && <div>added by {blog.user.name}</div>}

      <h3>comments</h3>
      <ul>
        {blog.comments && blog.comments.map((comment, index) => 
          <li key={index}>{comment}</li>
        )}
      </ul>
    </div>
  )
}

export default BlogView
