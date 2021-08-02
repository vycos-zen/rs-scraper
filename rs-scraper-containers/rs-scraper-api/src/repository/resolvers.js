import {
  dropCache,
  scrapeTargetSite,
  disconnectFromMongoDb,
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
      if (input.persistToCache) {
        getOrCreateScrapedSiteInDb(
          input._id,
          input.targetUrl,
          input.numberOfPages
        )
          .then((scrapedSite) => {
            const site = scrapedSite;
            console.log(`scraped site mutation with persist: ${scrapedSite}`);
            return site;
          })
          .catch((error) => {
            console.error(
              `error on getOrCreateScrapedSiteInDb: ${error.message}`
            );
          });
      } else {
        //dropCache();
        scrapeTargetSite(targetUrl)
          .then((scrapedPages) => {
            const filteredPages = scrapedPages.filter(
              (p) => p.pageNumber <= numberOfPages
            );

            const scrapedSite = {
              targetUrl: input.targetUrl,
              hitCount: 1,
              pageCount: filteredPages.length,
              scrapedPages: filteredPages.data,
            };

            return scrapedSite;
          })
          .catch((error) => {
            console.log(`error on scrapeTargetSite: ${error.message}`);
            return null;
          });
      }
    },
  },
};
