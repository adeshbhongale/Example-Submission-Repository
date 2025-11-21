import { ApolloServer } from 'apollo-server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import User from './models/user.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY_123'

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch(err => console.log("MongoDB connection error:", err.message))

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? (req.headers.authorization || '') : ''
    if (auth.toLowerCase().startsWith('bearer ')) {
      try {
        const token = auth.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET)
        const currentUser = await User.findById(decoded.id)
        return { currentUser }
      } catch (err) {
        console.log('Invalid token:', err.message)
      }
    }
    return { currentUser: null }
  }
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
