import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

export function RsScrapeInput({ props }) {
  const [numberOfPagesInQuery, setNumberOfPagesInQuery] = useState(0);

  const [maxPageCount, setMaxPageCount] = useState(0);

  const [isValid, setIsValid] = useState(false);

  const [wasValidated, setWasValidated] = useState(false);

  useEffect(() => {
    const getMaxPageCount = () => {
      return 5;
    };
    setMaxPageCount(getMaxPageCount());
    console.log(`setting page count to ${getMaxPageCount()}`);
  }, []);

  const validateForm = () => {
    setIsValid(
      numberOfPagesInQuery &&
        numberOfPagesInQuery > 0 &&
        maxPageCount > 0 &&
        numberOfPagesInQuery <= maxPageCount
    );
    setWasValidated(true);
  };

  const onInputChange = (e) => {
    setWasValidated(false);
    console.log(e.target.value);
    setNumberOfPagesInQuery(e.target.value);
    console.log(`${numberOfPagesInQuery}, ${maxPageCount}`);
    validateForm();
  };

  return (
    <Container>
      <Form noValidate validated={wasValidated}>
        <Form.Group className="mb-3">
          <Form.Label>
            Please sepcify the number of pages to scrape from 1-
            {maxPageCount}:
          </Form.Label>
          <Form.Control
            name="numberOfPages"
            type="number"
            value={numberOfPagesInQuery}
            onChange={(e) => onInputChange(e)}
            onBlur={validateForm}
            placeholder="0"
          />
        </Form.Group>
        <Button
          type="button"
          variant="primary"
          disabled={!isValid}
          onClick={props.refreshResults}
        >
          Scrape
        </Button>
      </Form>
    </Container>
  );
}
