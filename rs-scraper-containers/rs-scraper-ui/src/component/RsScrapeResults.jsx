import React from "react";
import { Container, ListGroup } from "react-bootstrap";
import { nanoid } from "nanoid"

export function RsScrapeResults({ props }) {
  const listItem = (scrapeResult) => (
    <ListGroup.Item key={nanoid()}>
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
