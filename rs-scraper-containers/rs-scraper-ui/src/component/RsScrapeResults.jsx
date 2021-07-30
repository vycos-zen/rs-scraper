import React from "react";
import { Container, ListGroup } from "react-bootstrap";
import { nanoid } from "nanoid";

export function RsScrapeResults({ props }) {
  const articleItem = (articleData) => (
    <ListGroup.Item>
      <span>{articleData.title}</span>
      <a href={articleData.articleUrl}>{articleData.articleUrl}</a>
    </ListGroup.Item>
  );

  const articleList = (scrapeResult) => (
    <ListGroup.Item key={nanoid()}>
      <span>Page: {scrapeResult.pageNumber}</span>
      <ListGroup>
        {scrapeResult.articles.map((article) => articleItem(article))}
      </ListGroup>
    </ListGroup.Item>
  );

  return (
    <Container>
      {console.log(props)}
      <ListGroup>
        {props.scrapeResult
          ? props.scrapeResults.scrapedPages.map((scrapeResult) =>
              articleList(scrapeResult)
            )
          : null}
      </ListGroup>
    </Container>
  );
}
