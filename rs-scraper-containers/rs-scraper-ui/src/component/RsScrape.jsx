import React, { useEffect, useState } from "react";
import { RsScrapeInput } from "./RsScrapeInput";
import { RsScrapeResults } from "./RsScrapeResults";
import {
  getNumberOfAvailablePagesQuery,
  getOrCreateScrapedSiteQuery,
} from "../common/namedQueries";
import { useQuery, useMutation } from "@apollo/client";
import { Container } from "react-bootstrap";

export function RsScrape() {
  const targetUrl = "https://blog.risingstack.com";
  const [siteId, setSiteId] = useState("");
  const [persistToCache, setPersistToCache] = useState(false);
  const [scrapedSite, setScrapedSite] = useState({});
  const [scrapedPages, setScrapedPages] = useState([]);

  const [numberOfAvailablePages, setNumberOfAvailablePages] = useState(0);

  const numberOfAvailablePagesData = useQuery(getNumberOfAvailablePagesQuery, {
    variables: { input: { _id: siteId, targetUrl: targetUrl } },
  });

  const [getOrCreateScrapedSite, getOrCreateScrapedSiteData] = useMutation(
    getOrCreateScrapedSiteQuery
  );

  useEffect(() => {
    const getNumberOfAvailablePages = async () => {
      try {
        if (!siteId) {
          console.log(`targetUrl: ${targetUrl}`);
          const site = await getOrCreateScrapedSite({
            variables: {
              input: {
                targetUrl: targetUrl,
                persistToCache: persistToCache,
              },
            },
          }).catch((error) => {
            console.log(
              `error in getAvailablePages -> getOrCreateScrapedSite: ${error.message}`
            );
            /* console.log(
                `getOrCreateScrapedSite mutation: ${JSON.stringify(
                  result.data
                )}` 
              );*/

            setSiteId(site._id);
            setNumberOfAvailablePages(site.pageCount);
            setScrapedPages(site.scrapedPages);
          });
        } else {
          console.log(`site id query, id: ${siteId}`);
          if (siteId) {
          }
        }
      } catch (error) {
        console.log(`error in getAvailablePages: ${error.message}`);
      }
    };

    getNumberOfAvailablePages();
  }, []);

  useEffect(() => {}, [getOrCreateScrapedSite]);

  const clearResults = () => {
    setScrapedSite({});
  };

  const onSubmitRequest = async (request) => {
    try {
      await getOrCreateScrapedSite({
        variables: {
          input: {
            targetUrl: request.targetUrl,
            persistToCache: request.persistToCache,
            numberOfPages: Number.parseInt(request.numberOfPages),
          },
        },
      }).then((result) => {
        console.log(
          `onSubmitRequest -> getOrCreateScrapedSite -> result:${JSON.stringify(
            result
          )}`
        );
        setScrapedSite(result.data.getOrCreateScrapedSite);
        setSiteId(scrapedSite._id);
      });

      if (scrapedSite) {
      } else {
        console.log(`no data received`);
      }
    } catch (error) {
      console.log(`error in refreshResults: ${error.message}`);
    }
  };

  return (
    <Container>
      <span>
        number of available pages:{" "}
        {`rs-scraper numberOfAvailablePagesData: ${console.log(
          numberOfAvailablePagesData.data
        )}`}
        {numberOfAvailablePagesData.data &&
          numberOfAvailablePagesData.data.getNumberOfAvailablePages}{" "}
        {persistToCache ? `cashe enabled` : `cache disabled`}
      </span>
      <RsScrapeInput
        props={{
          setPersistToCache: setPersistToCache,
          clearResults: clearResults,
          onSubmitRequest: onSubmitRequest,
          maxPageCount: numberOfAvailablePages,
        }}
      />
      <br />
      {getOrCreateScrapedSiteData.loading ? (
        <span> loading... </span>
      ) : (
        <RsScrapeResults props={{ scrapeResults: scrapedPages }} />
      )}
    </Container>
  );
}
