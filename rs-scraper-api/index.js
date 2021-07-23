import express from "express";
import expressgraphql from "express-graphql";
import { nanoid } from "nanoid";
import { rsSchema } from "./repository/schema.js";

const { graphqlHTTP } = expressgraphql;

const app = express();
const port = 4242;

const inMemoryOfDatabase = {};

const root = {
  targetUrl: () => {
    return "to the starts";
  },
  createScrapedSite: ({ input }) => {
    console.log(input);
    const id = nanoid();

    inMemoryOfDatabase.scrapedSite = input;
    inMemoryOfDatabase.scrapedSite.id = id;
    console.log(inMemoryOfDatabase);
    return inMemoryOfDatabase.scrapedSite;
  },
};

app.get("/", (req, res) => {
  res.send("i am server");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: rsSchema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(port, () => console.log(`node is listening on port: ${port}`));
