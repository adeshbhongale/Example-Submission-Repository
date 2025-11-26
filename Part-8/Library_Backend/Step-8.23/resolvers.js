import Author from "./models/author.js";
import Book from "./models/book.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    bookCount: () => Book.countDocuments(),
    authorCount: () => Author.countDocuments(),

    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) filter.author = author._id;
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }

      return Book.find(filter).populate("author");
    },

    allAuthors: () => Author.find({}),
    me: (root, args, context) => context.currentUser,

 
  // allAuthors: async () => {
  //   const authors = await Author.find({})   // IMPORTANT: use await
  //   return authors
  // },

  // allBooks: async () => {
  //   const books = await Book.find({}).populate('author')
  //   return books
  // },

    recommendedBooks: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated");
      }
      return Book.find({
        genres: { $in: [context.currentUser.favoriteGenre] }
      }).populate("author");
    }
  },

  Author: {
    bookCount: (root) => Book.countDocuments({ author: root._id })
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) throw new GraphQLError("Not authenticated");

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }

      let book = new Book({ ...args, author: author._id });
      await book.save();
      book = await book.populate("author");

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) throw new GraphQLError("Not authenticated");

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;

      author.born = args.setBornTo;
      return author.save();
    },

    createUser: async (root, args) => {
      const passwordHash = await bcrypt.hash("secret", 10);
      const user = new User({ ...args, passwordHash });
      return user.save();
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const correct = args.password === "secret";

      if (!user || !correct) {
        throw new GraphQLError("Invalid credentials");
      }

      return {
        value: jwt.sign({ id: user._id, username: user.username }, JWT_SECRET)
      };
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"])
    }
  }
};

export default resolvers;
