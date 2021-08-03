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
    },
    getNumberOfAvailablePages: async (_, { input }) => {
      try {
        const numberOfAvailablePages = await getNumberOfAvailablePagesInDb(
          input._id,
          input.targetUrl
        );

        return numberOfAvailablePages ? numberOfAvailablePages : 0;
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
        const site = await getOrCreateScrapedSiteInDb(
          input._id,
          input.targetUrl,
          input.numberOfPages
        );
        if (input.persistToCache) {
          console.log(`scraped site mutation with persist: ${site}`);
          return site;
        } else {
          await dropCache(input._id, input.targetUrl);

          const scrapedPages = await scrapeTargetSite(input.targetUrl);
          const filteredPages = scrapedPages.filter(
            (p) => p.pageNumber <= input.numberOfPages
          );
          site.pageCount = filteredPages.length;
          site.scrapedPages = filteredPages;

          return site;
        }
      } catch (error) {
        console.error(`error on getOrCreateScrapedSiteInDb: ${error.message}`);
      }
    },
  },
};
