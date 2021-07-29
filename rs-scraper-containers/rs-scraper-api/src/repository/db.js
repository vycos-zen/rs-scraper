import { ScrapedSite, collectionName } from "./models.js";
import { getScrapedPages } from "../common/scraperService.js";

const contextMongoDb = { mongoose: null, db: null, contextCollection: null };

const connectToDatastore = async () => {
  const mongoose = require("mongoose");

  contextMongoDb.mongoose = mongoose;

  const config = {
    mongoServer: prcoess.env.MONGO_SERVER,
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

const updateScrapedPages = async (siteId, scrapedPages) => {
  await connectToDatastore();
  const query = { _id: siteId };
  const update = {
    $set: {
      scrapedPages: scrapedPages,
    },
  };
  const options = { upsert: false };

  await contextMongoDb.contextCollection
    .updateOne(query, update, options)
    .then((result) => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log(`successfully updated scrapedPages.`);
      }
    })
    .catch((err) => console.error(`failed to update scrapedPages: ${err}`));
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

    let scrapedSiteWithTargetUrl =
      await contextMongoDb.contextCollection.findOne(locateSiteQuery);

    if (!scrapedSiteWithTargetUrl) {
      if (!targetUrl) {
        throw new Error("targetUrl is mandatory when no id provided");
      }
      scrapedSiteWithTargetUrl = await ScrapedSite.create({
        targetUrl: targetUrl,
      });
      console.log(`created new: ${scrapedSiteWithTargetUrl._id}`);
    }

    incrementHitCount(scrapedSiteWithTargetUrl._id);

    console.log(`rescrape site: ${reScrape}`);
    if (reScrape) {
      await scrape(scrapedSiteWithTargetUrl._id, numberOfPages);
    }

    scrapedSiteWithTargetUrl = await contextMongoDb.contextCollection.findOne(
      locateSiteQuery
    );

    console.log(
      `returning site: ${scrapedSiteWithTargetUrl._id}, hitcount ${scrapedSiteWithTargetUrl.hitCount}`
    );

    return scrapedSiteWithTargetUrl;
  } catch (e) {
    console.log(`error - getOrCreateScrapedSite: ${e.message}`);
    return e.message;
  }
};

export const scrape = async (siteId, numberOfPages) => {
  const query = { _id: siteId };
  const dropPages = {
    $set: {
      scrapedPages: [],
    },
  };

  await contextMongoDb.contextCollection
    .updateOne(query, dropPages)
    .then((result) => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log(`successfully dropped pages`);
      }
    })
    .then(async () => {
      const scrapedPages = await getScrapedPages(numberOfPages);
      await updateScrapedPages(siteId, scrapedPages);
    })
    .catch((err) => console.error(`failed to droped pages: ${err}`));
};
