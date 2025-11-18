import { books, authors } from './data.js'

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,

    allBooks: (root, args) => {
      let filteredBooks = books

      if (args.author) {
        filteredBooks = filteredBooks.filter(b => b.author === args.author)
      }

      if (args.genre) {
        filteredBooks = filteredBooks.filter(b => b.genres.includes(args.genre))
      }

      return filteredBooks
    },

    allAuthors: () => {
      return authors.map(author => ({
        name: author.name,
        bookCount: books.filter(b => b.author === author.name).length
      }))
    }
  }
}

export default resolvers;