const mongoose = require("mongoose");

const { Schema } = mongoose;

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

const ScrapedSiteSchema = new Schema({
  id: String,
  targetUrl: String,
  hitCount: Number,
  pageCount: Number,
  scrapedPages: [ScrapedPageSchema],
});

const ScrapedArticle = mongoose.model("ScrapedArticle", ScrapedArticleSchema);
const ScrapedPage = mongoose.model("ScrapedPage", ScrapedPageSchema);
export const ScrapedSite = mongoose.model("ScrapedSite", ScrapedSiteSchema);
