import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

export function RsScrapeInput({ refreshResults }) {
  console.log(refreshResults)
  const [componentData, setComponentData] = useState({});

  const onInputChange = (e) => {
    console.log(e.target.value);
    setComponentData({ numberOfPagesInQuery: e.target.value });
  };

  const onSubmit = () => {
    refreshResults();
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Number of pages to scrape:</Form.Label>
          <Form.Control
            type="number"
            value={componentData.numberOfPagesInQuery}
            onChange={(e) => onInputChange(e)}
            placeholder="0"
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
      {componentData.numberOfPagesInQuery}
    </Container>
  );
}
