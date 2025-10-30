const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})


const User = require('../models/user')
blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body
    if (!title || !url) {
        return response.status(400).json({ error: 'title and url are required' })
    }
    // Find any user (first one)
    const user = await User.findOne({})
    if (!user) {
        return response.status(400).json({ error: 'no users in database' })
    }
    const blog = new Blog({ title, author, url, likes, user: user._id })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
    response.status(201).json(populatedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        { new: true, runValidators: true, context: 'query' }
    )
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
