import { mongoDb } from "./db";

const { ScrapedSite, collectionName } = require("./models");

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
      console.log(`targetUrl: ${input.targetUrl}`);
      const db = await mongoDb();

      try {
        let scrapedSiteWithTargetUrl = await db
          .collection(collectionName)
          .findOne({
            targetUrl: input.targetUrl,
          });

        if (!scrapedSiteWithTargetUrl) {
          scrapedSiteWithTargetUrl = await ScrapedSite.create({ ...input });
          console.log(`created new: ${scrapedSiteWithTargetUrl._id}`);

          return scrapedSiteWithTargetUrl;
        } else {
          console.log(`returning existing: ${scrapedSiteWithTargetUrl._id}`);
          return scrapedSiteWithTargetUrl;
        }
      } catch (e) {
        console.log(`error - getOrCreateScrapedSite: ${e.message}`);
        return e.message;
      }
    },
  },
};
