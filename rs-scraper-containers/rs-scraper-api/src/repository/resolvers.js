import { nanoid } from "nanoid";
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
        return 0;
      }
    },
  },
  Mutation: {
    getOrCreateScrapedSite: async (_, { input }) => {
      console.log(
        `getOrCreate with id: ${input._id}, targetUrl: ${input.targetUrl}`
      );
      const getSiteIfExists = async () => {
        try {
          const siteInDb = await getOrCreateScrapedSiteInDb(
            input._id,
            input.targetUrl,
            input.numberOfPages
          );

          if (!siteInDb) {
            return null;
          }

          if (input.persistToCache) {
            console.log(`scraped site mutation with persist: ${siteInDb}`);
            return siteInDb;
          } else {
            await dropCache(input._id, input.targetUrl);

            return siteInDb;
          }
        } catch (error) {
          console.error(
            `error on getOrCreateScrapedSiteInDb: ${error.message}`
          );
        }
      };

      try {
        const scrapedPages = await scrapeTargetSite(input.targetUrl);
        const filteredPages = scrapedPages.filter(
          (p) => p.pageNumber <= input.numberOfPages
        );

        let site = await getSiteIfExists();
        if (!site) {
          site = {
            _id: nanoid(),
            targetUrl: input.targetUrl,
            hitCount: 1,
          };
        }
        site.pageCount = filteredPages.length;
        site.scrapedPages = filteredPages;

        return site;
      } catch (error) {
        console.error(`error on scrapeTargetSite: ${error.message}`);
      }
    },
  },
};
