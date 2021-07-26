const { collectionName } = require("./models");
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
      console.log(`connected to mongodb collection: ${scrapedSiteCollection.collection.collectionName}`);
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

const scrape = async (numberOfPages) => {
  for (let index = 0; index < numberOfPages; index++) {
    console.log(index);
  }
};
