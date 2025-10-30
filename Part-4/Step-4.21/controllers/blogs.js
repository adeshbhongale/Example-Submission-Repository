
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../middleware/tokenExtractor')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})


const User = require('../models/user')
blogsRouter.post('/', userExtractor, async (request, response) => {
    const { title, author, url, likes } = request.body
    if (!title || !url) {
        return response.status(400).json({ error: 'title and url are required' })
    }
    if (!request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(request.user.id)
    if (!user) {
        return response.status(400).json({ error: 'user not found' })
    }
    const blog = new Blog({ title, author, url, likes, user: user._id })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
    response.status(201).json(populatedBlog)
})


blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    if (!request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    if (blog.user && blog.user.toString() !== request.user.id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete this blog' })
    }
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
