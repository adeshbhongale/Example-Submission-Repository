

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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
