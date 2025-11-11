const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  const authorLikes = {}

  blogs.forEach(blog => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + (blog.likes || 0)
  })

  let maxLikes = 0
  let topAuthor = null

  for (const author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      maxLikes = authorLikes[author]
      topAuthor = author
    }
  }

  return topAuthor
    ? { author: topAuthor, likes: maxLikes }
    : null
}
const dummy = (blogs) => {
    return 1
}

const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) return null
    return blogs.reduce((fav, blog) => (fav.likes > blog.likes ? fav : blog))
}


const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  const authorCounts = {}

  blogs.forEach(blog => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  })

  let maxBlogs = 0
  let topAuthor = null

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author]
      topAuthor = author
    }
  }

  return topAuthor
    ? { author: topAuthor, blogs: maxBlogs }
    : null
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
