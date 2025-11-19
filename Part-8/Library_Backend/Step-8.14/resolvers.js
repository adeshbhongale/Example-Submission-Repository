import Author from './models/author.js'
import Book from './models/book.js'

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async () => {
      return Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({})
  },

  Mutation: {
    addBook: async (root, args) => {
      // find author or create if missing
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

      await book.save()
      return book.populate('author')
    },

    editAuthor: async () => {
      return null
    }
  }
}

export default resolvers;