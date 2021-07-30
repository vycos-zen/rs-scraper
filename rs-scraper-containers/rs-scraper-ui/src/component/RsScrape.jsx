import React, { useEffect, useState } from "react";
import { RsScrapeInput } from "./RsScrapeInput";
import { RsScrapeResults } from "./RsScrapeResults";
import { Container } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";

export function RsScrape() {
  const [results, setResults] = useState({});

  const [numberOfPages, setNumberOfPages] = useState(0);

  const queryHello = gql`
    query Query {
      hello
    }
  `;

  // const { loading, error, data } = useQuery(queryHello);

  const getOrCreateScrapedSiteQuery = gql`
    mutation GetOrCreateScrapedSite($input: ScrapedSiteInput!) {
      getOrCreateScrapedSite(input: $input) {
        _id
        targetUrl
        hitCount
        scrapedPages {
          articleCount
          articles {
            title
          }
        }
      }
    }
  `;

  const [getOrCreateScrapedSite, { data, loading }] = useMutation(
    getOrCreateScrapedSiteQuery
  );

  useEffect(() => {
    const refreshResults = async () => {
      try {
        const scrapedSiteResult = await getOrCreateScrapedSite({
          variables: {
            input: {
              targetUrl: "to the stars",
              reScrape: false,
              numberOfPages: 1,
            },
          },
        });

        console.log(
          scrapedSiteResult ? scrapedSiteResult : "refreshResults not defined"
        );
        setResults(scrapedSiteResult.data.getOrCreateScrapedSite);
      } catch (error) {
        console.log(`error in refreshResults: ${error.message}`);
      }
    };

    if (numberOfPages > 0) {
      refreshResults();
    }
  }, [numberOfPages]);

  return (
    <Container>
      <RsScrapeInput
        props={{
          setNumberOfPages: setNumberOfPages,
        }}
      />
      <br />
      <RsScrapeResults props={{ scrapeResults: results }} />
    </Container>
  );
}
