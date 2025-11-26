import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import typeDefs from './schema.js';
import resolvers from './resolvers.js';
import User from './models/user.js';
import { bookCountLoader } from './loaders/bookCountLoader.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'SUPERSECRET';
const PORT = process.env.PORT || 4000;

console.log('Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err.message));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    let currentUser = null;

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
        currentUser = await User.findById(decodedToken.id);
      } catch (e) {
        console.log('Invalid token:', e.message);
      }
    }

    return {
      currentUser,
      loaders: {
        bookCountLoader
      }
    };
  }
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
