import express from "express";
import expressgraphql from "express-graphql";
import cors from "cors";
import { nanoid } from "nanoid";
import { rsSchema } from "./repository/schema.js";

const { graphqlHTTP } = expressgraphql;

const app = express();
const port = 4242;

const inMemoryOfDatabase = {};
inMemoryOfDatabase.scrapedSite = {};

const root = {
  targetUrl: () => {
    return "to the starts";
  },
  getOrCreateScrapedSite: ({ input }) => {
    console.log({ input });
    console.log(Object.keys(inMemoryOfDatabase.scrapedSite));
    const instanceId = "id001";
      /* Object.keys(inMemoryOfDatabase.scrapedSite).length > 0
        ? "id001"
        : Object.values(inMemoryOfDatabase.scrapedSite)[0].id; */
    console.log(`instanceId: ${instanceId}`);
    inMemoryOfDatabase.scrapedSite[instanceId] = input;
    console.log(inMemoryOfDatabase);
    return { id: instanceId };
  },
};

app.use(cors());

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
