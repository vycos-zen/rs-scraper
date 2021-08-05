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
  const [maxPageCount, setMaxPageCount] = useState(0);

  const numberOfAvailablePagesData = useQuery(getNumberOfAvailablePagesQuery, {
    variables: { input: { _id: siteId, targetUrl: targetUrl } },
  });

  const [getOrCreateScrapedSite, getOrCreateScrapedSiteData] = useMutation(
    getOrCreateScrapedSiteQuery
  );

  useEffect(() => {
    if (!numberOfAvailablePagesData.loading && numberOfAvailablePagesData.data)
      setMaxPageCount(
        numberOfAvailablePagesData.data.getNumberOfAvailablePages
      );
  }, [numberOfAvailablePagesData]);

  const clearResults = () => {
    setScrapedSite({});
    console.log(`clearResults ${JSON.stringify(scrapedSite)}`);
  };

  useEffect(() => {
    if (
      !getOrCreateScrapedSiteData.loading &&
      getOrCreateScrapedSiteData.data
    ) {
      setScrapedSite(getOrCreateScrapedSiteData.data.getOrCreateScrapedSite);
      setSiteId(getOrCreateScrapedSiteData.data.getOrCreateScrapedSite._id);
    }
  }, [getOrCreateScrapedSiteData, getOrCreateScrapedSiteData.loading]);

  const submitRequest = async (request) => {
    try {
      await getOrCreateScrapedSite({
        variables: {
          input: {
            _id: siteId,
            targetUrl: targetUrl,
            persistToCache: persistToCache,
            numberOfPages: Number.parseInt(request.numberOfPages),
          },
        },
      });
    } catch (error) {
      console.log(`error in submitRequest: ${error}`);
    }
  };

  return (
    <Container>
      <span>welcome to rs-scrape. (target url: {targetUrl})</span>
      <RsScrapeInput
        props={{
          maxPageCount: maxPageCount,
          persistToCache: persistToCache,
          setPersistToCache: setPersistToCache,
          clearResults: clearResults,
          onSubmitRequest: submitRequest,
        }}
      />
      <br />
      {getOrCreateScrapedSiteData.loading ? (
        <span> loading... </span>
      ) : (
        <RsScrapeResults
          props={{
            scrapedPages: scrapedSite.scrapedPages
              ? scrapedSite.scrapedPages
              : [],
          }}
        />
      )}
    </Container>
  );
}
