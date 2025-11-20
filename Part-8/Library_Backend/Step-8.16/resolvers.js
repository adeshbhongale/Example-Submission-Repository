import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import Author from './models/author.js'
import Book from './models/book.js'
import User from './models/user.js'
import dotenv from 'dotenv'

dotenv.config();

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),

    allBooks: async (root, args) => {
      let filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },

    allAuthors: async () => Author.find({}),

    me: (root, args, context) => context.currentUser
  },

  Mutation: {
    // ---------------- CREATE USER ----------------
    createUser: async (root, args) => {
      try {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre
        })

        return await user.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username
          }
        })
      }
    },

    // ---------------- LOGIN ----------------
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      const hardcodedPassword = "secret"

      if (!user || args.password !== hardcodedPassword) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    // ---------------- ADD BOOK (AUTH REQUIRED) ----------------
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" }
        })
      }

      try {
        let author = await Author.findOne({ name: args.author })

        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id
        })

        return await book.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title
          }
        })
      }
    },

    // ---------------- EDIT AUTHOR (AUTH REQUIRED) ----------------
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" }
        })
      }

      try {
        const author = await Author.findOne({ name: args.name })
        if (!author) return null

        author.born = args.setBornTo
        return author.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name
          }
        })
      }
    }
  }
}

export default resolvers;