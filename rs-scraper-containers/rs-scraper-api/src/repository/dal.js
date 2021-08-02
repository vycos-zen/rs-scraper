import { ScrapedSite, collectionName } from "./models.js";
import { scrapeSitePages } from "../common/scraperService.js";
import mongoose from "mongoose";

const dataStoreContext = { db: null, mongoose: null, contextCollection: null };

const getDataStoreContext = async () => {
  if (
    dataStoreContext.db &&
    dataStoreContext.mongoose &&
    dataStoreContext.contextCollection
  ) {
    return new Promise((resolve) => {
      resolve(dataStoreContext);
    });
  }

  let contextDb;
  let contextCollection;
  let contextDataSourceError;

  try {
    contextDb = await connectToDatastore();
    contextCollection = contextDb.db.collection(collectionName);
  } catch (error) {
    contextDataSourceError = error;
  }

  return new Promise((resolve, reject) => {
    if (contextDb.db && contextDb.contextCollection) {
      dataStoreContext.db = contextDb.db;
      dataStoreContext.mongoose = contextDb.mongoose;
      dataStoreContext.contextCollection = contextCollection;

      resolve(dataStoreContext);
    } else {
      reject(contextDataSourceError);
    }
  });
};

const connectToDatastore = () => {
  const contextMongoose = mongoose;
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
    const db = contextMongoose.connection;

    contextMongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    db.once("open", () => {
      console.log("connected to mongodb");
      return new Promise((resolve, reject) => {
        resolve({ db: db, mongoose: contextMongoose });
      });
    });

    db.on("error", (error) => {
      return new Promise((resolve, reject) => {
        reject(`error connecting to mongodb: ${error.message}`);
      });
    });
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(`error on connectToDatastore: ${error.message}`);
    });
  }
};

export const disconnectFromMongoDb = () => {
  if (!contextDataSource.db) {
    return;
  }
  contextDataSource.mongoose.disconnect();
};

const locateSite = async (siteId, targetUrl) => {
  let contextSiteDocument;
  let locateSiteError;

  try {
    const locateSiteQuery = {
      $or: [{ _id: siteId }, { targetUrl: targetUrl }],
    };
    console.log(
      `contextDataSource at locateSite: ${Object.keys(dataStoreContext)}`
    );
    await getDataStoreContext();

    await dataStoreContext.contextCollection
      .findOne(locateSiteQuery)
      .then((result) => {
        contextSiteDocument = result.data;
      })
      .catch((error) => {
        locateSiteError = error;
      });
  } catch (error) {
    locateSiteError = error;
  }

  return new Promise((resolve, reject) => {
    if (contextSiteDocument) {
      resolve(contextSiteDocument);
    } else if (locateSiteError) {
      reject(locateSiteError);
    } else {
      reject(new Error(`unable to locate site...`));
    }
  });
};

const incrementHitCount = async (siteId) => {
  try {
    const contextSite = await locateSite(siteId, null);
    const query = { _id: contextSite._id };
    const incrementHitCount = {
      $inc: { hitCount: 1 },
    };

    await contextDataSource.contextCollection
      .updateOne(query, incrementHitCount)
      .then((result) => {
        const { matchedCount, modifiedCount } = result;
        if (matchedCount && modifiedCount) {
          console.log(`incremented hitCount`);
        }
      });
  } catch (err) {
    console.error(`error incrementing hitCount: ${err}`);
  }
};

export const getNumberOfAvailablePagesInDb = async (siteId, targetUrl) => {
  try {
    const contextSite = await locateSite(siteId, targetUrl);

    if (contextSite) {
      return new Promise((resolve, reject) => {
        resolve(contextSite.pageCount);
      });
    }
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
};

export const getOrCreateScrapedSiteInDb = async (
  siteId,
  targetUrl,
  numberOfPages
) => {
  try {
    let contextSite = await locateSite(siteId, targetUrl);

    if (!contextSite) {
      if (!targetUrl) {
        throw new Error("targetUrl is mandatory when no id provided");
      }
      const scrapedPages = scrapeTargetSite(targetUrl);
      contextSite = await ScrapedSite.create({
        targetUrl: targetUrl,
        hitCount: 1,
        pageCount: scrapedPages.length,
        scrapedPages: scrapedPages,
      });
      console.log(`created new: ${contextSite._id}`);
    }
    {
      incrementHitCount(contextSite._id);
    }

    console.log(`typeof contextsite: ${Object.keys(contextSite)}`);
    contextSite.scrapedPages = contextSite.scrapedPages.filter(
      (p) => p.pageNumber <= numberOfPages
    );

    console.log(
      `returning site: ${contextSite._id}, hitcount ${contextSite.hitCount}, persisted pages count: ${contextSite.scrapedPages.length} / requested: ${numberOfPages} / returning: ${contextSite.scrapedPages.length}`
    );

    return contextSite;
  } catch (e) {
    console.log(`error - getOrCreateScrapedSite: ${e.message}`);
    return e.message;
  }
};

export const dropCache = async (siteId) => {
  const query = { _id: siteId };
  const dropPages = {
    $set: {
      scrapedPages: [],
    },
  };

  contextMongoDb.contextCollection
    .updateOne(query, dropPages)
    .then((result) => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log(`successfully dropped pages`);
      }
    })
    .catch((err) => console.error(`failed to droped pages: ${err}`));
};

export const scrapeTargetSite = async (targetUrl) => {
  // possibly refactor to an available sub page discovery logic
  const targetUrlSubPageCollection = Array.from([
    `${targetUrl}`,
    `${targetUrl}/page/2/`,
    `${targetUrl}/page/3/`,
    `${targetUrl}/page/4/`,
    `${targetUrl}/page/5/`,
  ]);

  let scrapedPages;
  let scrapeTargetSiteError;

  try {
    scrapedPages = await scrapeSitePages(targetUrlSubPageCollection);
  } catch (error) {
    scrapeTargetSiteError = error;
  }
  return new Promise((resolve, reject) => {
    if (scrapedPages) {
      resolve(scrapedPages);
    } else if (scrapeTargetSiteError) {
      reject(scrapeTargetSiteError);
    } else {
      reject(new Error(`error on sraping target site`));
    }
  });
};
