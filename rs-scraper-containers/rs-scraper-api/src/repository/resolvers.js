import {
  dropCache,
  scrapeTargetSite,
  getOrCreateScrapedSiteInDb,
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
    getNumberOfAvailablePages: async (_, { input }) => {
      try {
        console.log(
          `getNumberOfAvailablePages input: { siteId: ${input._id}, targetUrl: ${input.targetUrl} }`
        );
        const numberOfAvailablePages = await getNumberOfAvailablePagesInDb(
          input._id,
          input.targetUrl
        );
        if (numberOfAvailablePages) {
          console.log(`number of available pages: ${numberOfAvailablePages}`);
          return numberOfAvailablePages;
        }
      } catch (error) {
        console.error(`error on getNumberOfAvailablePages: ${error.message}`);
      }
    },
  },
  Mutation: {
    getOrCreateScrapedSite: async (_, { input }) => {
      console.log(
        `getOrCreate with id: ${input._id}, targetUrl: ${input.targetUrl}`
      );
      try {
        if (input.persistToCache) {
          const site = await getOrCreateScrapedSiteInDb(
            input._id,
            input.targetUrl,
            input.numberOfPages
          );
          console.log(`scraped site mutation with persist: ${site}`);
          return site;
        } else {
          await dropCache(input._id, input.targetUrl);
          const scrapedPages = await scrapeTargetSite(input.targetUrl);
          const filteredPages = scrapedPages.filter(
            (p) => p.pageNumber <= input.numberOfPages
          );

          const scrapedSite = {
            targetUrl: input.targetUrl,
            hitCount: 1,
            pageCount: filteredPages.length,
            scrapedPages: filteredPages,
          };

          return scrapedSite;
        }
      } catch (error) {
        console.error(`error on getOrCreateScrapedSiteInDb: ${error.message}`);
      }
    },
  },
};
