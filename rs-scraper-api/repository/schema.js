import graphql from "graphql";
const { buildSchema } = graphql;

export const rsSchema = buildSchema(`
type ScrapedSite {
  id: ID!
  targetUrl: String!
  hitCount: Int
  pageCount: Int
  scrapedPages: [ScrapedPage]
}

input ScrapedSiteInput {
  targetUrl: String!
  pageCount: Int
}

type ScrapedPage {
  pageNumber: Int!
  articleCount: Int
  articles: [ScrapedArticle]
}

input ScrapedPageInput {
  pageNumber: Int!
}

type ScrapedArticle {
  title: String
  articleUrl: String
  authorName: String
  description: String
}

input ScrapedArticleInput {
  title: String!
  articleUrl: String!
  authorName: String
  description: String
}

type Query {
  targetUrl: String
  getScrapedSiteData: ScrapedSite
}

type Mutation {
  getOrCreateScrapedSite(input: ScrapedSiteInput): ScrapedSite
  createScrapedPages(id: ID!, input: ScrapedPageInput): ScrapedPage
  createScrapedArticle(
    siteId: ID!
    pageNumber: Int!
    article: ScrapedArticleInput
  ): ScrapedArticle
}

`);
