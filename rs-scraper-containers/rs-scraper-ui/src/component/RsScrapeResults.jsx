import React from "react";
import { Container, ListGroup } from "react-bootstrap";

export function RsScrapeResults({ props }) {
  const articleItem = (articleData) => (
    <ListGroup.Item key={articleData._id}>
      <span>
        id: {articleData._id}
        {articleData.title}
      </span>
      <a href={articleData.articleUrl}>{articleData.articleUrl}</a>
    </ListGroup.Item>
  );

  const articleList = (scrapedPage) => (
    <ListGroup.Item key={scrapedPage._id}>
      <span>
        page #: {scrapedPage.pageNumber}
        id: {scrapedPage._id}
      </span>
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
