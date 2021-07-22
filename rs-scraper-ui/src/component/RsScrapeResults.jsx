import React from "react";
import { Container, ListGroup } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

export function RsScrapeResults({ props }) {
  const listItem = (scrapeResult) => (
    <ListGroup.Item key={uuidv4()}>
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
