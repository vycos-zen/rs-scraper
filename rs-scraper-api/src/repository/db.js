const {
  ScrapedSite,
  ScrapedPage,
  ScrapedArticle,
  collectionName,
} = require("./models");
export const mongoDb = async () => {
  return db ? db : await connectToDatastore();
};

let db;

const connectToDatastore = async () => {
  const mongoose = require("mongoose");
  const config = {
    mongoEnv: process.env.MONGO_ENV,
    mongoUsr: process.env.MONGO_USR,
    mongoSecret: process.env.MONGO_SECRET,
    mongoDb: process.env.MONGO_DB,
    cluster: process.env.MONGO_CLUSTER,
    domain: process.env.MONGO_DOMAIN,
  };
  const uri = `mongodb+srv://${config.mongoUsr}:${config.mongoSecret}@${config.cluster}${config.domain}/${config.mongoDb}?retryWrites=true&w=majority`;

  console.log(`connecting to mongodb environment: ${config.mongoEnv}`);

  const db = mongoose.connection;

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  db.once("open", async () => {
    const scrapedSiteCollection = db.collection(collectionName);
    if (scrapedSiteCollection) {
      console.log(
        `connected to mongodb collection: ${scrapedSiteCollection.collection.collectionName}`
      );
    }
  });

  db.on("error", () => {
    console.log("error connecting to mongodb");
  });
  return db;
};

export const disconect = () => {
  if (!db) {
    return;
  }
  mongoose.disconnect();
};

const updateScrapedPages = async (siteId, scrapedPages) => {
  const db = await mongoDb();
  const scrapedSiteCollection = db.collection(collectionName);
  const query = { _id: siteId };
  const update = {
    $inc: { hitcount: 1 },
    $set: {
      scrapedPages: scrapedPages,
    },
  };
  const options = { upsert: false };

  await scrapedSiteCollection
    .updateOne(query, update, options)
    .then((result) => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log(`successfully updated the item.`);
      }
    })
    .catch((err) => console.error(`failed to update the item: ${err}`));
};

export const getOrCreateScrapedSiteInDb = async (
  siteId,
  targetUrl,
  reScrape,
  numberOfPages
) => {
  const db = await mongoDb();
  const scrapedSiteCollection = db.collection(collectionName);

  try {
    let scrapedSiteWithTargetUrl = await scrapedSiteCollection.findOne({
      $or: [{ _id: siteId }, { targetUrl: targetUrl }],
    });

    console.log(`scrapedSiteWithTargetUrl object: ${scrapedSiteWithTargetUrl}`);

    if (!scrapedSiteWithTargetUrl) {
      if (!targetUrl) {
        throw new Error("targetUrl is mandatory");
      }
      console.log(`${scrapedSiteWithTargetUrl}`);
      scrapedSiteWithTargetUrl = await ScrapedSite.create({
        hitCount: 1,
        targetUrl: targetUrl,
      });
      console.log(`created new: ${scrapedSiteWithTargetUrl._id}`);
    }

    if (reScrape) {
      console.log(`rescrape: ${reScrape}`);
      await scrape(scrapedSiteWithTargetUrl._id, reScrape, numberOfPages);
    }
    console.log(
      `returning existing: ${
        (scrapedSiteWithTargetUrl._id, scrapedSiteWithTargetUrl.hitCount)
      }`
    );
    return scrapedSiteWithTargetUrl;
  } catch (e) {
    console.log(`error - getOrCreateScrapedSite: ${e.message}`);
    return e.message;
  }
};

const getScrapedPages = (numberOfPages) => {
  if (!numberOfPages || typeof numberOfPages !== "number") {
    throw new Error(`invalid input for number, got: ${numberOfPages}`);
  }
  const pages = [];
  for (let index = 0; index < numberOfPages; index++) {
    const articles = Array.from([
      new ScrapedArticle({
        title: "first time on graphql",
        articleUrl: "web address",
        authorName: "me",
        description: "graphql rocks",
      }),
      new ScrapedArticle({
        title: "first time on graphql",
        articleUrl: "web address",
        authorName: "me",
        description: "graphql still rocks",
      }),
    ]);

    const page = new ScrapedPage({
      pageNumber: index,
      articleCount: 1,
      articles: articles,
    });
    pages.push(page);
  }

  console.log(`pages: ${pages}`);

  return pages;
};

export const scrape = async (siteId, dropExisting, numberOfPages) => {
  // dev mock
  const scrapedPages = getScrapedPages(numberOfPages);
  // dev mock

  const db = await mongoDb();
  const scrapedSiteCollection = db.collection(collectionName);

  const query = { _id: siteId };
  const dropPages = {
    $inc: { hitcount: 1 },
    $set: {
      scrapedPages: [],
    },
  };

  await scrapedSiteCollection
    .updateOne(query, dropPages)
    .then((result) => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log(`successfully droped pages`);
        updateScrapedPages(siteId, scrapedPages);
      }
    })
    .catch((err) => console.error(`failed to droped pages: ${err}`));
};
