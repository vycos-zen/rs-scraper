import { ScrapedSite, collectionName } from "./models.js";
import { scrapeSitePages } from "../common/scraperService.js";
import mongoose from "mongoose";

const contextMongoDb = { mongoose: null, db: null, contextCollection: null };

const connectToDatastore = async () => {
  contextMongoDb.mongoose = mongoose;

  const config = {
    mongoServer: process.env.MONGO_SERVER,
    mongoDbPort: process.env.MONGO_PORT,
    mongoEnv: process.env.MONGO_ENV,
    mongoUsr: process.env.MONGO_USR,
    mongoSecret: process.env.MONGO_SECRET,
    mongoDb: process.env.MONGO_DB,
    cluster: process.env.MONGO_CLUSTER,
    domain: process.env.MONGO_DOMAIN,
  };
  const uri = config.mongoServer.includes("+srv")
    ? `${config.mongoServer}${config.mongoUsr}:${config.mongoSecret}@${config.cluster}${config.domain}/${config.mongoDb}?retryWrites=true&w=majority`
    : `
  ${config.mongoServer}${config.mongoEnv}:${config.mongoDbPort}/${config.mongoDb}`;

  console.log(`connecting to mongodb environment: ${config.mongoEnv}`);

  try {
    contextMongoDb.db = contextMongoDb.mongoose.connection;

    contextMongoDb.mongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    contextMongoDb.db.once("open", async () => {
      contextMongoDb.contextCollection =
        contextMongoDb.db.collection(collectionName);
      if (contextMongoDb.contextCollection) {
        console.log(
          `connected to mongodb collection: ${contextMongoDb.contextCollection.collection.collectionName}`
        );
      }
    });

    contextMongoDb.db.on("error", () => {
      console.log("error connecting to mongodb");
    });
    return contextMongoDb.db;
  } catch (error) {
    console.log("error on connectToDatastore");
  }
};

export const disconnectFromMongoDb = () => {
  if (!contextMongoDb.db) {
    return;
  }
  contextMongoDb.mongoose.disconnect();
};

const incrementHitCount = async (siteId) => {
  const query = { _id: siteId };
  const incrementHitCount = {
    $inc: { hitCount: 1 },
  };
  await contextMongoDb.contextCollection
    .updateOne(query, incrementHitCount)
    .then((result) => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log(`incremented hitCount`);
      }
    })
    .catch((err) => console.error(`error incrementing hitCount: ${err}`));
};

const populateScrapedPagesInDb = async (siteId, scrapedPages) => {
  await connectToDatastore();
  const query = { _id: siteId };
  const populateScrapedPages = {
    $set: {
      scrapedPages: scrapedPages,
    },
  };
  const options = { upsert: false };

  await contextMongoDb.contextCollection
    .updateOne(query, populateScrapedPages, options)
    .then((result) => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log(`successfully updated scrapedPages.`);
      }
    })
    .catch((err) => console.error(`failed to update scrapedPages: ${err}`));
};

export const getNumberOfAvailablePagesInDb = async (siteId) => {
  await connectToDatastore();

  const getNumberOfAvailablePagesQuery = { _id: siteId };

  let contextSite = await contextMongoDb.contextCollection.findOne(
    getNumberOfAvailablePagesQuery
  );

  return contextSite ? contextSite.pageCount : 0;
};

export const getOrCreateScrapedSiteInDb = async (
  siteId,
  targetUrl,
  reScrape,
  numberOfPages
) => {
  try {
    await connectToDatastore();
    const locateSiteQuery = {
      $or: [{ _id: siteId }, { targetUrl: targetUrl }],
    };

    const getSiteWithRequestedNumberOfPagesQuery = {
      // scrapedPages.pageNumber is less than requested number of pages query
      pageNumber: { $lte: numberOfPages },

      /*  _id: siteId,
      scrapedPages: {
      }, */
    };

    let contextSite = await contextMongoDb.contextCollection.findOne(
      locateSiteQuery
    );

    if (!contextSite) {
      if (!targetUrl) {
        throw new Error("targetUrl is mandatory when no id provided");
      }
      reScrape = true;

      contextSite = await ScrapedSite.create({
        targetUrl: targetUrl,
      });
      console.log(`created new: ${contextSite._id}`);
    }

    incrementHitCount(contextSite._id);

    console.log(`rescrape site: ${reScrape}`);
    if (reScrape) {
      await scrapeAndPopulate(contextSite._id, contextSite.targetUrl);
    }

    try {
      console.log(`typeof contextsite: ${Object.keys(contextSite)}`);
      contextSite.scrapedPages = contextSite.scrapedPages.filter(
        (p) => p.pageNumber <= numberOfPages
      );

      /*   await contextSite.scrapedPages.filter(
        getSiteWithRequestedNumberOfPagesQuery
        );
       */
    } catch (err) {
      console.error(`error on filter pages: ${err.message}`);
    }

    console.log(
      `returning site: ${contextSite._id}, hitcount ${contextSite.hitCount}, persisted pages count: ${contextSite.scrapedPages.length} / requested: ${numberOfPages} / returning: ${contextSite.scrapedPages.length}`
    );

    return contextSite;
  } catch (e) {
    console.log(`error - getOrCreateScrapedSite: ${e.message}`);
    return e.message;
  }
};

export const scrapeAndPopulate = async (siteId, targetUrl) => {
  // possibly refactor to return scraped pages without persistation
  const query = { _id: siteId };
  const dropPages = {
    $set: {
      scrapedPages: [],
    },
  };

  // possibly refactor to an available sub page discovery logic
  const targetUrlSubPageCollection = Array.from([
    `${targetUrl}`,
    `${targetUrl}/page/2/`,
    `${targetUrl}/page/3/`,
    `${targetUrl}/page/4/`,
    `${targetUrl}/page/5/`,
  ]);

  await contextMongoDb.contextCollection
    .updateOne(query, dropPages)
    .then((result) => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log(`successfully dropped pages`);
      }
    })
    .then(async () => {
      const scrapedPages = await scrapeSitePages(targetUrlSubPageCollection);

      await populateScrapedPagesInDb(siteId, scrapedPages);
    })
    .catch((err) => console.error(`failed to droped pages: ${err}`));
};
