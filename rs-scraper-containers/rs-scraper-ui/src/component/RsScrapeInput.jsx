import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";

export function RsScrapeInput({ props }) {
  const [numberOfPagesToQuery, setNumberOfPagesToQuery] = useState(1);

  const [isValid, setIsValid] = useState(true);

  const [wasValidated, setWasValidated] = useState(false);

  const numberOfPagesRef = useRef();

  const scrapeButtonRef = useRef();

  const clearButtonRef = useRef();

  useEffect(() => {
    const isValidInput = () => {
      return true;
      /* return (
        numberOfPagesToQuery &&
        numberOfPagesToQuery > 0 &&
        props.maxPageCount > 0 &&
        numberOfPagesToQuery <= props.maxPageCount
      ); */
    };

    setIsValid(isValidInput());
  }, [numberOfPagesToQuery]);

  useEffect(() => {
    setWasValidated(isValid);
  }, [isValid]);

  const scrapePages = () => {
    scrapeButtonRef.current.blur();
    if (isValid) {
      props.onSubmitRequest({
        numberOfPages: numberOfPagesToQuery,
        persistToCache: props.persistToCache,
      });
    }
  };

  const clearQuery = () => {
    clearButtonRef.current.blur();
    setNumberOfPagesToQuery(1);
    props.clearResults();
  };

  const handleSetCache = (e) => {
    props.setPersistToCache(e.target.checked);
  };

  return (
    <Container>
      <Form validated={wasValidated}>
        <Container>
          <Row className="justify-content-md-center">
            <Col xs lg="6" style={{ padding: 0 }}>
              <InputGroup
                className={isValid ? "mb-3 isValid" : "mb-3 isInvalid"}
              >
                <InputGroup.Text>
                  # of pages{" "}
                  {props.maxPageCount ? `(1 - ${props.maxPageCount})` : `n/a`}
                </InputGroup.Text>
                <FormControl
                  name="numberOfPages"
                  ref={numberOfPagesRef}
                  type="number"
                  value={numberOfPagesToQuery}
                  onChange={(e) => setNumberOfPagesToQuery(e.target.value)}
                  onBlur={(e) => setNumberOfPagesToQuery(e.target.value)}
                  placeholder="0"
                  required={true}
                />
                <FormControl.Feedback type="invalid">
                  Expecting a number between 1 - {props.maxPageCount}
                </FormControl.Feedback>
              </InputGroup>
            </Col>
            <Col md="auto" style={{ padding: 0 }}>
              <InputGroup>
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
                <InputGroup.Text>{`cache results`} </InputGroup.Text>
                <InputGroup.Checkbox
                  checked={props.persistToCache}
                  onChange={handleSetCache}
                />
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </Form>
    </Container>
  );
}
