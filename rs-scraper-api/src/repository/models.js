const mongoose = require("mongoose");

export const collectionName = "scrapedSiteCollection";

const { Schema } = mongoose;
const collection = { collection: collectionName };

const ScrapedArticleSchema = new Schema({
  title: String,
  articleUrl: String,
  authorName: String,
  description: String,
});

const ScrapedPageSchema = new Schema({
  pageNumber: Number,
  articleCount: Number,
  articles: [ScrapedArticleSchema],
});

const ScrapedSiteSchema = new Schema(
  {
    targetUrl: String,
    hitCount: Number,
    pageCount: Number,
    scrapedPages: [ScrapedPageSchema],
  },
  { ...collection }
);

/* export const ScrapedArticle = mongoose.model("ScrapedArticle", ScrapedArticleSchema, collectionName);
export const ScrapedPage = mongoose.model("ScrapedPage", ScrapedPageSchema, collectionName);
 */
export const ScrapedSite = mongoose.model(
  "ScrapedSite",
  ScrapedSiteSchema,
  collectionName
);
