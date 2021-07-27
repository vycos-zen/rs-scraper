const { gql } = require("apollo-server-express");

export const typeDefs = gql`
  type ScrapedSite {
    _id: ID!
    targetUrl: String!
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
    pageNumber: Int!
    articleCount: Int
    articles: [ScrapedArticle]
  }

  type ScrapedArticle {
    title: String
    articleUrl: String
    authorName: String
    description: String
  }

  type Query {
    hello: String
    targetUrl(siteId: ID): String
    getScrapedPages(siteId: ID, numberOfPages: Int): [ScrapedPage]
  }

  type Mutation {
    getOrCreateScrapedSite(input: ScrapedSiteInput!): ScrapedSite
  }
`;
