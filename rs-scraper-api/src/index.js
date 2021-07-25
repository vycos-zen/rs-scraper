import cors from "cors";
import { typeDefs, resolvers } from "./repository/schema.js";
import {
  getOrCreateScrapedSite,
  getScrapedSite,
} from "./repository/mongoMockDb.js";
const { ApolloServer } = require("apollo-server-express");
const express = require("express");

const startApolloServer = async (typeDefs, resolvers) => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const port = 4242;
  const app = express();
  app.use(cors());
  app.get("/", (req, res) => {
    res.send("i am server");
  });

  server.applyMiddleware({ app });
  await new Promise((resolve) => app.listen({ port: port }, resolve)).catch(
    (error) => console.log(error)
  );

  //console.log(server);

  return { server, app };
};

const { server, app } = startApolloServer(typeDefs, resolvers);

console.log(`node running on ${server}`);
