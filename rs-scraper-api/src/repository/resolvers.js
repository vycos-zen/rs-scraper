import { getOrCreateScrapedSiteInDb, disconnectFromMongoDb } from "./db";

const { collectionName } = require("./models");

export const resolvers = {
  Query: {
    hello: () => "helloo",
    targetUrl: async (siteID) => {
      const db = await mongoDb();
      let scrapedSiteTargetUrlWithId = await db
        .collection(collectionName)
        .findOne({
          _id: input._id,
        });

      return scrapedSiteTargetUrlWithId
        ? scrapedSiteTargetUrlWithId
        : "Site does not exists.";
    },
    getScrapedPages: (siteId, numberOfPages) => {
      return null;
    },
  },
  Mutation: {
    getOrCreateScrapedSite: async (_, { input }) => {
      console.log(
        `getOrCreate with id: ${input._id}, targetUrl: ${input.targetUrl}`
      );

      const scrapedSite = await getOrCreateScrapedSiteInDb(
        input._id,
        input.targetUrl,
        input.reScrape,
        input.numberOfPages
      );
      await disconnectFromMongoDb();

      return scrapedSite;
    },
  },
};
