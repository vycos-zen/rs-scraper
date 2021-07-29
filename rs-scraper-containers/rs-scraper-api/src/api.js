import cors from "cors";
import { typeDefs } from "./repository/typeDefs.js";
import { resolvers } from "./repository/resolvers.js";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import dotenv from "dotenv";

const startApolloServer = async (typeDefs, resolvers) => {
  dotenv.config();
  const port = process.env.API_PORT;

  console.log(process.env.HELLO);

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
    console.log(
      `url: ${
        process.env.NODE_ENV === "development"
          ? "localhost"
          : process.env.API_DOMAIN
      }:${service.port}${service.server.graphqlPath}`
    );
  })
  .catch((error) => {
    console.log(`error: ${error}`);
  });
