import React from "react";
import { ListGroup, Card, Button } from "react-bootstrap";

export function RsScrapeResults({ props }) {
  const articleItem = (articleData) => (
    <ListGroup.Item key={articleData._id}>
      <Card style={{ width: "48rem" }}>
        <Card.Body>
          <Card.Title>{articleData.title}</Card.Title>
          <Card.Text>by {articleData.authorName}</Card.Text>
          <Card.Text>{articleData.description}</Card.Text>
          <Button variant="link" href={articleData.articleUrl}>
            {articleData.articleUrl}
          </Button>
        </Card.Body>
      </Card>
    </ListGroup.Item>
  );

  const articleList = (scrapedPage) => (
    <ListGroup.Item key={scrapedPage._id}>
      <Card style={{ width: "52rem" }}>
        <Card.Body>
          <Card.Title>page #: {scrapedPage.pageNumber}</Card.Title>
          <ListGroup>
            {scrapedPage.articles.map((article) => articleItem(article))}
          </ListGroup>
        </Card.Body>
      </Card>
    </ListGroup.Item>
  );

  return (
    <>
      <ListGroup>
        {props.scrapeResults ||
          (props.scrapeResults.scrapedPages &&
            props.scrapeResults.scrapedPages.map((scrapeResult) =>
              articleList(scrapeResult)
            ))}
      </ListGroup>
    </>
  );
}
