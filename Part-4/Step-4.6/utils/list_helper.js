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
}
