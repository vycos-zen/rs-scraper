const { gql } = require("apollo-server-express");
const { ScrapedSite, ScrapedPage, ScrapedArticle } = require("./models");

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
        let scrapedSiteWithTargetUrl = await ScrapedSite.find({
          targetUrl: input.targetUrl,
        }).exec();

        console.log(
          `scrapedSiteWithTargetUrl: ${scrapedSiteWithTargetUrl._id}`
        );
        if (!scrapedSiteWithTargetUrl._id) {
          console.log("create...");

          scrapedSiteWithTargetUrl = await ScrapedSite.create({ ...input });

          return scrapedSiteWithTargetUrl;
        } else {
          console.log(`response: ${scrapedSiteWithTargetUrl}`);
          return scrapedSiteWithTargetUrl;
        }
      } catch (e) {
        console.log(`error - getOrCreateScrapedSite: ${e.message}`);
        return e.message;
      }
    },
  },
};

const getScrapedSite = (id) => {
  console.log(`hit getScrapedSite`);
};
