import Author from './models/author.js'
import Book from './models/book.js'

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),

    allBooks: async (root, args) => {
      let filter = {}

      // Filter by author name → convert to ObjectId
      if (args.author) {
        const foundAuthor = await Author.findOne({ name: args.author })
        if (!foundAuthor) return []
        filter.author = foundAuthor._id
      }

      // Filter by genre
      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },

    // 8.14 → bookCount NOT required
    allAuthors: async () => Author.find({})
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      // Create author if missing
      if (!author) {
        author = new Author({ name: args.author, born: null })
        await author.save()
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      })

      await book.save()
      return book.populate('author')
    },

    addAuthor: async (root, args) => {
      const author = new Author({
        name: args.name,
        born: args.born || null
      })
      return author.save()
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      return author.save()
    }
  }
}

export default resolvers
