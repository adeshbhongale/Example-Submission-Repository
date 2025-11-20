import { ApolloServer } from 'apollo-server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import User from './models/user.js'

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch(err => console.log(err.message))

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
  const auth = req.headers.authorization
  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const currentUser = await User.findById(decoded.id)
    return { currentUser }
  }
  return {}
  }
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
