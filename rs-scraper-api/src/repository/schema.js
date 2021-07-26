import { response } from "express";
import { nanoid } from "nanoid";
const { gql } = require("apollo-server-express");
const { ScrapedSite } = require("./models");

export const typeDefs = gql`
  type ScrapedSite {
    id: ID!
    targetUrl: String!
    hitCount: Int
    pageCount: Int
    scrapedPages: [ScrapedPage]
  }

  input ScrapedSiteInput {
    id: ID
    targetUrl: String!
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
    hello: String
    targetUrl: String
    getScrapedSite(id: ID): ScrapedSite
  }

  type Mutation {
    getOrCreateScrapedSite(input: ScrapedSiteInput!): ScrapedSite
    createScrapedPages(id: ID!, input: ScrapedPageInput): ScrapedPage
    createScrapedArticle(
      siteId: ID!
      pageNumber: Int!
      article: ScrapedArticleInput
    ): ScrapedArticle
  }
`;

export const resolvers = {
  Query: {
    hello: () => "helloo",
    targetUrl: () => {
      return "to the starts";
    },
    getScrapedSite: (id) => {
      const siteData = getScrapedSite(id);
      console.log(siteData);
      return siteData ? siteData : null;
    },
  },
  Mutation: {
    getOrCreateScrapedSite: async (_, { input }) => {
      console.log(`targetUrl: ${input.targetUrl}`);

      try {
        const response = await ScrapedSite.create(input);
        console.log(`response: ${response}`);
        return response;
      } catch (e) {
        console.log(`error - getOrCreateScrapedSite: ${e.message}`);
        return e.message;
      }
    },
  },
};

const inMemoryOfDatabase = {};
inMemoryOfDatabase.scrapedSite = {};

const getOrCreateScrapedSite = (targetUrl) => {
  console.log(`object keys - ${Object.keys(inMemoryOfDatabase.scrapedSite)}`);
  console.log(`object values - ${Object.values(inMemoryOfDatabase)}`);
  if (id && targetUrl) {
    if (Object.entries().some()) {
      return Object.entries()[0];
    } else {
      inMemoryOfDatabase.scrapedSite[id] = {
        id: nanoid(),
      };
    }
  } else console.log(`failed to getOrCreateScrapedSite`);
};

const getScrapedSite = (id) => {
  console.log(`hit getScrapedSite`);
};
