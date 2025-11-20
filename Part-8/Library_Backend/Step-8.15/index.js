import { ApolloServer } from 'apollo-server'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

console.log('Connecting to MongoDB...')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB ✅')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})