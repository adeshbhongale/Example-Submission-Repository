import { GraphQLError } from "graphql"
import jwt from "jsonwebtoken"
import Author from "./models/author.js"
import Book from "./models/book.js"
import User from "./models/user.js"

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),

    allBooks: async () => {
      // Fetch books
      const books = await Book.find({})

      // FIX: Convert author string → Author object
      return Promise.all(
        books.map(async (book) => {
          // If already ObjectId, population will work
          if (book.author && typeof book.author !== "string") {
            return book.populate("author")
          }

          // If author name is string → find Author document
          const authorDoc = await Author.findOne({ name: book.author })

          // Attach the author doc manually
          return {
            ...book.toObject(),
            author: authorDoc || null
          }
        })
      )
    },

    allAuthors: async () => Author.find({}),

    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: async (root) => {
      // Count books whose author name matches
      return Book.countDocuments({ author: root.name })
    }
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "UNAUTHENTICATED" }
        })
      }

      // Find author by name
      let author = await Author.findOne({ name: args.author })

      // If author not found → create new one
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      // Save book with AUTHOR OBJECTID
      const newBook = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id          // <-- store ObjectId (CORRECT)
      })

      try {
        const savedBook = await newBook.save()

        // Return saved book with populated author object
        return savedBook.populate("author")
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error
          }
        })
      }
  },

    addAuthor: async (root, args) => {
      try {
        const author = new Author({
          name: args.name,
          born: args.born || null
        })

        return await author.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
    },
    
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "UNAUTHENTICATED" }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      return author.save()
    },

    createUser: async (root, args) => {
      const user = new User({ ...args })

      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError("Creating user failed", {
          extensions: { code: "BAD_USER_INPUT", error }
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "password") {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" }
        })
      }

      const userToken = {
        username: user.username,
        id: user._id
      }

      return {
        value: jwt.sign(userToken, process.env.JWT_SECRET)
      }
    }
  }
}

export default resolvers
