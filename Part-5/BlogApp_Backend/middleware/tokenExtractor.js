const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

const userExtractor = (request, response, next) => {
  if (request.token) {
    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      request.user = decodedToken
    } catch (error) {
      request.user = null
    }
  } else {
    request.user = null
  }
  next()
}

module.exports = { tokenExtractor, userExtractor }
