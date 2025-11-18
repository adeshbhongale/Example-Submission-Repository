import { books, authors } from './data.js'

let booksData = books
let authorsData = authors

const resolvers = {
  Query: {
    bookCount: () => booksData.length,
    authorCount: () => authorsData.length,

    allBooks: (root, args) => {
      let filteredBooks = booksData

      if (args.author) {
        filteredBooks = filteredBooks.filter(b => b.author === args.author)
      }

      if (args.genre) {
        filteredBooks = filteredBooks.filter(b => b.genres.includes(args.genre))
      }

      return filteredBooks
    },

    allAuthors: () => {
      return authorsData.map(author => ({
        ...author,
        born: author.born || null,
        bookCount: booksData.filter(b => b.author === author.name).length
      }))
    }
  },

  Mutation: {
    addBook: (root, args) => {
      const newBook = { ...args }
      booksData = booksData.concat(newBook);
      if (!authorsData.find(a => a.name === args.author)) {
        authorsData = authorsData.concat({ name: args.author, born: null })
      }

      return newBook
    },

    editAuthor: (root, args) => {
      const author = authorsData.find(a => a.name === args.name)
      if (!author) return null

      const updatedAuthor = { ...author, born: args.setBornTo }
      authorsData = authorsData.map(a => a.name === args.name ? updatedAuthor : a)

      return {
        ...updatedAuthor,
        bookCount: booksData.filter(b => b.author === updatedAuthor.name).length
      }
    }
  }
}

export default resolvers;