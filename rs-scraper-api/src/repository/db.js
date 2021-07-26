let db;
export const mongoDb = async () => {
  if (db) {
    return db;
  } else {
    const db = await connectToDatastore();
    return db;
  }
};

const connectToDatastore = async () => {
  const config = {
    mongoEnv: process.env.MONGO_ENV,
    mongoUsr: process.env.MONGO_USR,
    mongoSecret: process.env.MONGO_SECRET,
    mongoDb: process.env.MONGO_DB,
    cluster: process.env.MONGO_CLUSTER,
    domain: process.env.MONGO_DOMAIN,
  };
  const mongoose = require("mongoose");
  console.log(`connecting to ${config.mongoEnv}`);
  const uri = `mongodb+srv://${config.mongoUsr}:${config.mongoSecret}@${config.cluster}${config.domain}/${config.mongoDb}?retryWrites=true&w=majority`;
  const db = mongoose.connection;

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  db.once("open", async () => {
    console.log("connected to mongodb");
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
