import Author from './models/author.js'
import Book from './models/book.js'

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),

    allBooks: async (root, args) => {
      let filter = {}

      if (args.author) {
        filter.author = args.author
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter)
    },

    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({})

      return authors.map(a => ({
        name: a.name,
        born: a.born,
        bookCount: books.filter(b => b.author === a.name).length
      }))
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      // ensure author exists
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author, born: null })
        await author.save()
      }

      const book = new Book({
        title: args.title,
        author: args.author,
        published: args.published,
        genres: args.genres
      })

      return book.save()
    },

    addAuthor: async (root, args) => {
      const author = new Author({ name: args.name, born: args.born || null })
      return author.save()
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      await author.save()

      const bookCount = await Book.countDocuments({ author: author.name })

      return {
        name: author.name,
        born: author.born,
        bookCount
      }
    }
  }
}

export default resolvers
