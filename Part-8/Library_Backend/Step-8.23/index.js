import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import User from "./models/user.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = http.createServer(app);

// WS SERVER FOR SUBSCRIPTIONS
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema
});

await server.start();

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization || "";

      if (auth.startsWith("bearer ")) {
        try {
          const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
          const currentUser = await User.findById(decoded.id);
          return { currentUser };
        } catch {
          return {};
        }
      }
      return {};
    }
  })
);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  console.log(`🚀 Subscriptions at ws://localhost:${PORT}/graphql`);
});
