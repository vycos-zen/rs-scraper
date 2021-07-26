import cors from "cors";
import { typeDefs, resolvers } from "./repository/schema.js";
import { connectToDatastore } from "./repository/db.js";
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const dotenv = require("dotenv");

const startApolloServer = async (typeDefs, resolvers) => {
  const config = dotenv.config();
  const port = process.env.API_PORT;

  console.log(process.env.HELLO);

  const db = connectToDatastore();

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

  return { server, app, port };
};

const service = startApolloServer(typeDefs, resolvers);

service
  .then((service) => {
    console.log(`node running on ${service.port}`);
  })
  .catch((error) => {
    console.log(`error: ${error}`);
  });
