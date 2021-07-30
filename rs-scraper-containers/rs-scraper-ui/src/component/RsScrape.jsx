import React, { useEffect, useState } from "react";
import { RsScrapeInput } from "./RsScrapeInput";
import { RsScrapeResults } from "./RsScrapeResults";
import { Container } from "react-bootstrap";
import { getOrCreateScrapedSiteWithId } from "../common/RsScraperDAL";
import { ScrapedSiteRequest } from "../common/models";

export function RsScrape() {
  const [results, setResults] = useState({});

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    const refreshResults = async () => {
      const scrapedSiteResult = await getOrCreateScrapedSiteWithId(
        new ScrapedSiteRequest("", "to the stars", false, 1)
      );

      console.log(scrapedSiteResult);
      setResults(scrapedSiteResult);
    };

    refreshResults();
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
