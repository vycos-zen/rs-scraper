import React, { useState } from "react";
import { RsScrapeInput } from "./RsScrapeInput";
import { RsScrapeResults } from "./RsScrapeResults";
import { Container } from "react-bootstrap";
import { ScrapedResult } from "../common/ScrapedResult";

const mockData = Array.from([
  new ScrapedResult("buzz", 1, 1),
  new ScrapedResult("fizz buzz", 1, 2),
]);

export function RsScrape() {
  const [results, setResults] = useState([]);

  const refreshResults = () => {
    setResults(mockData);
  };

  return (
    <Container>
      <RsScrapeInput props={{ refreshResults: refreshResults }} />
      <br />
      <RsScrapeResults props={{ scrapeResults: results }} />
    </Container>
  );
}
