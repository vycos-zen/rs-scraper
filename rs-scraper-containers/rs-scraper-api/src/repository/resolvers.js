import {
  getOrCreateScrapedSiteInDb,
  disconnectFromMongoDb,
  getNumberOfAvailablePagesInDb,
} from "./dal.js";

export const resolvers = {
  Query: {
    hello: () => "helloo",
    targetUrl: async (_, { siteId }) => {
      return "unavailable";
      /*       const db = await mongoDb();
      let scrapedSiteTargetUrlWithId = await db
        .collection(collectionName)
        .findOne({
          _id: input._id,
        });

      return scrapedSiteTargetUrlWithId
        ? scrapedSiteTargetUrlWithId
        : "Site does not exists."; */
    },
    getNumberOfAvailablePages: async (_, { siteId }) => {
      const numberOfAvailablePages = await getNumberOfAvailablePagesInDb(
        siteId
      );

      return 2;
      //return numberOfAvailablePages;
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
