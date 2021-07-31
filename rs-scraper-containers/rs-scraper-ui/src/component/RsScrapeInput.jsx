import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";

export function RsScrapeInput({ props }) {
  const [numberOfPagesToQuery, setNumberOfPagesToQuery] = useState(0);

  const [maxPageCount, setMaxPageCount] = useState(0);

  const [isValid, setIsValid] = useState(false);

  const [wasValidated, setWasValidated] = useState(false);

  const numberOfPagesRef = useRef();

  const scrapeButtonRef = useRef();

  const clearButtonRef = useRef();

  useEffect(() => {
    const getMaxPageCount = () => {
      return 5;
    };
    setMaxPageCount(getMaxPageCount());
  }, [maxPageCount]);

  useEffect(() => {
    const isValidInput = () => {
      return (
        numberOfPagesToQuery &&
        numberOfPagesToQuery > 0 &&
        maxPageCount > 0 &&
        numberOfPagesToQuery <= maxPageCount
      );
    };

    setIsValid(isValidInput());
  }, [numberOfPagesToQuery, maxPageCount]);

  useEffect(() => {
    setWasValidated(isValid);
  }, [isValid]);

  const scrapePages = () => {
    scrapeButtonRef.current.blur();
    if (isValid) {
      props.setNumberOfPages(numberOfPagesToQuery);
    }
  };

  const clearQuery = () => {
    clearButtonRef.current.blur();
    setNumberOfPagesToQuery(0);
    props.clearResults();
    props.setNumberOfPages(0);
  };

  return (
    <Container>
      <Form noValidate validated={wasValidated}>
        <Form.Group className="mb-3" controlId="validation01">
          <Form.Label>
            Please specify the number of pages to scrape from 1-
            {maxPageCount}:
          </Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text># of pages</InputGroup.Text>
            <Form.Control
              name="numberOfPages"
              ref={numberOfPagesRef}
              type="number"
              value={numberOfPagesToQuery}
              onChange={(e) => setNumberOfPagesToQuery(e.target.value)}
              onBlur={(e) => setNumberOfPagesToQuery(e.target.value)}
              placeholder="0"
              required={true}
            />
          </InputGroup>
          <Form.Control.Feedback type="invalid">
            Expecting a number between 1 - {maxPageCount}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          name="scrapeButton"
          ref={scrapeButtonRef}
          type="button"
          variant="primary"
          disabled={!isValid}
          onClick={scrapePages}
        >
          Scrape
        </Button>{" "}
        <Button
          name="clearButton"
          ref={clearButtonRef}
          variant="secondary"
          onClick={clearQuery}
        >
          Clear
        </Button>
      </Form>
    </Container>
  );
}
