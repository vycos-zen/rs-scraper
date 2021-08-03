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
  const [persistToCache, setPersistToCache] = useState(true);
  const [scrapedSite, setScrapedSite] = useState({});
  const [scrapedPages, setScrapedPages] = useState([]);
  const [maxPageCount, setMaxPageCount] = useState(0);

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
          });

          setScrapedPages(site.scrapedPages);
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

  useEffect(() => {
    setSiteId(scrapedSite._id);
    setScrapedPages(scrapedSite.scrapedPages);
    setMaxPageCount(scrapedSite.pageCount);
  }, [scrapedSite]);

  const clearResults = () => {
    setScrapedSite({});
  };

  const onSubmitRequest = async (request) => {
    try {
      const site = await getOrCreateScrapedSite({
        variables: {
          input: {
            targetUrl: request.targetUrl,
            persistToCache: persistToCache,
            numberOfPages: Number.parseInt(request.numberOfPages),
          },
        },
      });
      if (site) {
        setScrapedSite(site);
      }
    } catch (error) {
      console.log(`error in refreshResults: ${error}`);
    }
  };

  return (
    <Container>
      <span>
        number of available pages:{" "}
        {numberOfAvailablePagesData.data &&
          numberOfAvailablePagesData.data.pageCount}{" "}
        {persistToCache ? `cache enabled` : `cache disabled`}
      </span>
      <RsScrapeInput
        props={{
          maxPageCount: maxPageCount,
          persistToCache: persistToCache,
          setPersistToCache: setPersistToCache,
          clearResults: clearResults,
          onSubmitRequest: onSubmitRequest,
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
