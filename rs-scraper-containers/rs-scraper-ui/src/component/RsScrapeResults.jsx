import React from "react";
import { Container, ListGroup } from "react-bootstrap";

export function RsScrapeResults({ props }) {
  const articleItem = (articleData) => (
    <ListGroup.Item key={articleData._id}>
      <span>{articleData.title}</span>
      <a href={articleData.articleUrl}>{articleData.articleUrl}</a>
    </ListGroup.Item>
  );

  const articleList = (scrapedPage) => (
    <ListGroup.Item key={scrapedPage._id}>
      <span>Page: {scrapedPage.pageNumber}</span>
      <ListGroup>
        {scrapedPage.articles.map((article) => articleItem(article))}
      </ListGroup>
    </ListGroup.Item>
  );

  return (
    <Container>
      <ListGroup>
        {props.scrapeResults.scrapedPages &&
          props.scrapeResults.scrapedPages.map((scrapeResult) =>
            articleList(scrapeResult)
          )}
      </ListGroup>
    </Container>
  );
}
