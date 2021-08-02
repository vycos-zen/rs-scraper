import { gql } from "@apollo/client";

export const getOrCreateScrapedSiteQuery = gql`
  mutation GetOrCreateScrapedSite($input: ScrapedSiteInput!) {
    getOrCreateScrapedSite(input: $input) {
      _id
      targetUrl
      hitCount
      pageCount
      scrapedPages {
        _id
        pageNumber
        articleCount
        articles {
          _id
          title
          authorName
          articleUrl
          description
        }
      }
    }
  }
`;

export const getNumberOfAvailablePagesQuery = gql`
  query GetNumberOfAvailablePages($input: NumberOfAvailablePagesInput!) {
    getNumberOfAvailablePages(input: $input)
  }
`;
