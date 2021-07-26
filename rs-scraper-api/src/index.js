import cors from "cors";
import { typeDefs } from "./repository/typeDefs";
import { resolvers } from "./repository/resolvers";
import { mongoDb } from "./repository/db";
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const dotenv = require("dotenv");

const startApolloServer = async (typeDefs, resolvers) => {
  dotenv.config();
  const port = process.env.API_PORT;

  console.log(process.env.HELLO);

  const db = await mongoDb();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  app.use(cors());
  app.get("/", (req, res) => {
    res.send("i am server");
  });

  server.applyMiddleware({ app });
  await new Promise((resolve) => app.listen({ port: port }, resolve)).catch(
    (error) => console.log(error)
  );

  return { server, app, db, port };
};

const service = startApolloServer(typeDefs, resolvers);

service
  .then((service) => {
    console.log(`node running on ${service.port}`);
  })
  .catch((error) => {
    console.log(`error: ${error}`);
  });
