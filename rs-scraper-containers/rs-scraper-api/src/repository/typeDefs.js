import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type ScrapedSite {
    _id: ID!
    targetUrl: String
    hitCount: Int
    pageCount: Int
    scrapedPages: [ScrapedPage]
  }

  input ScrapedSiteInput {
    _id: ID
    targetUrl: String
    reScrape: Boolean
    numberOfPages: Int
  }

  type ScrapedPage {
    _id: ID!
    pageNumber: Int!
    articleCount: Int
    articles: [ScrapedArticle]
  }

  type ScrapedArticle {
    _id: ID!
    title: String
    articleUrl: String
    authorName: String
    description: String
  }

  type Query {
    hello: String
    targetUrl(siteId: ID): String
    getNumberOfAvailablePages(siteId: ID!): Int
  }

  type Mutation {
    getOrCreateScrapedSite(input: ScrapedSiteInput!): ScrapedSite
  }
`;
