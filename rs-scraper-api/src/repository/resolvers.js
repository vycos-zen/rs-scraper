import { mongoDb } from "./db";

const { ScrapedSite, collectionName } = require("./models");

export const resolvers = {
  Query: {
    hello: () => "helloo",
    targetUrl: () => {
      return "to the starts";
    },
    getScrapedPages: (siteId, numberOfPages) => {
      
      return null;
    },
  },
  Mutation: {
    getOrCreateScrapedSite: async (_, { input }) => {
      console.log(`targetUrl: ${input.targetUrl}`);
      const db = await mongoDb();
      const scrapedSiteCollection = db.collection(collectionName);

      try {
        let scrapedSiteWithTargetUrl = await scrapedSiteCollection.findOne({
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
