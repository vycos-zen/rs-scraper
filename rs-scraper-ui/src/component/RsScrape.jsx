import React, { useEffect, useState } from "react";
import { RsScrapeInput } from "./RsScrapeInput";
import { RsScrapeResults } from "./RsScrapeResults";
import { Container } from "react-bootstrap";
import { ScrapedResult } from "../common/ScrapedResult";
import { getTargetUrl } from "../common/RsScraperDAL"

export function RsScrape() {
  const [results, setResults] = useState([]);

  const [numberOfPages, setNumberOfPages] = useState(0);


  useEffect(() => {
    const refreshResults = () => {
      const data = [];
      console.log(getTargetUrl())

      // TODO: replace mock data generation with api call once due
      if (numberOfPages > 0) {
        for (let i = 1; i <= numberOfPages; i++) {
          data.push(new ScrapedResult("buzz fizz", i, 1));
          data.push(new ScrapedResult("fizz buzz", i, 2));
        }
        setResults(data);
      } else {
        setResults([]);
      }
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
