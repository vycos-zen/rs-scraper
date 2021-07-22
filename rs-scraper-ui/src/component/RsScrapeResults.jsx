import React from "react";
import { Container, ListGroup } from "react-bootstrap";

export function RsScrapeResults({ props }) {

  const listItem = (scrapeResult) => (
    <ListGroup.Item
      key={`${scrapeResult.pageNumber}${scrapeResult.indexOnPage}`}
    >
      <span>
        Article: {scrapeResult.pageNumber}/{scrapeResult.indexOnPage} Link:{" "}
        {scrapeResult.articleLink}
      </span>
    </ListGroup.Item>
  );

  return (
    <Container>
      <ListGroup>
        {props.scrapeResults.map((scrapeResult) => listItem(scrapeResult))}
      </ListGroup>
    </Container>
  );
}
