import React, { useEffect, useState } from "react";
import { RsScrapeInput } from "./RsScrapeInput";
import { RsScrapeResults } from "./RsScrapeResults";
import { Container } from "react-bootstrap";
import { gql, useQuery, useMutation } from "@apollo/client";

export function RsScrape() {
  const [targetUrl, setTargetUrl] = useState("https://blog.risingstack.com");
  const [siteId, setSiteId] = useState("");
  const [reScrape, setReScrape] = useState(false);
  const [results, setResults] = useState({});

  const [numberOfPages, setNumberOfPages] = useState(0);

  const [numberOfAvailablePages, setNumberOfAvailablePages] = useState(0);

  const getOrCreateScrapedSiteQuery = gql`
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

  const getNumberOfAvailablePagesQuery = gql`
    query GetNumberOfAvailablePages($siteId: ID!) {
      getNumberOfAvailablePages(siteId: $siteId)
    }
  `;

  const numberOfAvailablePagesData = useQuery(getNumberOfAvailablePagesQuery, {
    variables: { siteId: siteId },
  });

  const [getOrCreateScrapedSite, getOrCreateScrapedSiteData] = useMutation(
    getOrCreateScrapedSiteQuery
  );

  useEffect(() => {
    const refreshResults = async () => {
      try {
        await getOrCreateScrapedSite({
          variables: {
            input: {
              targetUrl: targetUrl,
              reScrape: true,
              numberOfPages: Number.parseInt(numberOfPages),
            },
          },
        }).then((result) => {
          setResults(result.data.getOrCreateScrapedSite);
        });

        /*     console.log(
          scrapedSiteResult ? scrapedSiteResult : "refreshResults not defined"
        ); */
        if (results) {
        } else {
          console.log(`no data received`);
        }
      } catch (error) {
        console.log(`error in refreshResults: ${error.message}`);
      }
    };

    if (numberOfPages > 0) {
      refreshResults();
    }
  }, [numberOfPages]);

  useEffect(() => {
    const getAvailablePages = async () => {
      try {
        if (!siteId) {
          await getOrCreateScrapedSite({
            variables: {
              input: {
                targetUrl: targetUrl,
                reScrape: false,
                numberOfPages: Number.parseInt(numberOfPages),
              },
            },
          })
            .then((result) => {
              console.log(JSON.stringify(result));
              setSiteId(result.data.getOrCreateScrapedSite._id);
              setNumberOfAvailablePages(
                result.data.getOrCreateScrapedSite.pageCount
              );
            })
            .catch((error) => {
              console.log(
                `error in getAvailablePages -> getOrCreateScrapedSite: ${error.message}`
              );
            });
        } else {
          console.log(`site id query, id: ${siteId}`);
          if (siteId) {
            /*   await getNumberOfAvailablePages({ siteId: siteId })
              .then((result) => {
                console.log(
                  `get number of available pages query result: ${JSON.stringify(
                    result
                  )}`
                );
                setNumberOfAvailablePages(numberOfAvailablePages);
              })
              .catch((error) => {
                console.log(
                  `error in getAvailablePages -> getNumberOfAvailablePages: ${error.message}`
                );
              }); */
          }
        }
      } catch (error) {
        console.log(`error in getAvailablePages: ${error.message}`);
      }
    };

    getAvailablePages();
  }, [numberOfAvailablePages]);

  const clearResults = () => {
    setResults({});
  };

  return (
    <Container>
      <span>
        number of available pages:{" "}
        {numberOfAvailablePagesData.data &&
          numberOfAvailablePagesData.data.getNumberOfAvailablePages}
      </span>
      <RsScrapeInput
        props={{
          setNumberOfPages: setNumberOfPages,
          clearResults: clearResults,
        }}
      />
      <br />
      {getOrCreateScrapedSiteData.loading ? (
        <span> loading... </span>
      ) : (
        <RsScrapeResults props={{ scrapeResults: results }} />
      )}
    </Container>
  );
}
