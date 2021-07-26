const mongoose = require("mongoose");

const { Schema } = mongoose;
const collectionName = "scrapedSiteCollection";
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

export const ScrapedArticle = mongoose.model("ScrapedArticle", ScrapedArticleSchema);
export const ScrapedPage = mongoose.model("ScrapedPage", ScrapedPageSchema);
export const ScrapedSite = mongoose.model("ScrapedSite", ScrapedSiteSchema);
