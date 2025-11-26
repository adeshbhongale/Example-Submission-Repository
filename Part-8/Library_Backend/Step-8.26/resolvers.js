import Author from './models/author.js';
import Book from './models/book.js';
import User from './models/user.js';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPERSECRET';

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),

    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) filter.author = author._id;
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }

      return Book.find(filter).populate('author');
    },

    allAuthors: async () => Author.find({}),

    me: (root, args, context) => context.currentUser,

    recommendedBooks: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" }
        });
      }

      return Book.find({ genres: { $in: [context.currentUser.favoriteGenre] } })
        .populate("author");
    }
  },

  Author: {
    bookCount: (root, args, context) => {
      // Use DataLoader to avoid n+1 problem
      return context.loaders.bookCountLoader.load(root._id);
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" }
        });
      }

      try {
        let author = await Author.findOne({ name: args.author });

        if (!author) {
          author = new Author({ name: args.author });
          await author.validate();
          await author.save();
        }

        const book = new Book({ ...args, author: author._id });

        await book.validate();
        await book.save();

        return book.populate("author");
      } catch (error) {
        throw new GraphQLError("Saving book failed: " + error.message, {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args }
        });
      }
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" }
        });
      }

      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) return null;

        author.born = args.setBornTo;
        await author.save();

        return author;
      } catch (error) {
        throw new GraphQLError("Updating author failed: " + error.message, {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args }
        });
      }
    },

    createUser: async (root, args) => {
      try {
        const passwordHash = await bcrypt.hash("secret", 10);

        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
          passwordHash
        });

        await user.save();
        return user;
      } catch (error) {
        throw new GraphQLError("User creation failed: " + error.message, {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args }
        });
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const passwordCorrect = args.password === "secret";

      if (!user || !passwordCorrect) {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id
      };

      return {
        value: jwt.sign(userForToken, JWT_SECRET)
      };
    }
  }
};

export default resolvers;
