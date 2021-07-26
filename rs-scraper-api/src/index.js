import cors from "cors";
import { typeDefs, resolvers } from "./repository/schema.js";
import { connectToDatastore } from "./repository/db.js";
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const dotenv = require("dotenv");

const startApolloServer = async (typeDefs, resolvers) => {
  const config = dotenv.config();

  console.log(config);
  console.log(process.env.HELLO);

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const port = process.env.API_PORT;
  const db = connectToDatastore();
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
