import React, { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";

export function RsScrapeResults({ props }) {
  const [displayedResults, setDisplayedResults] = useState([]);

  useEffect(() => {
    if (props && props.results) {
      setDisplayedResults(props.results);
      console.log(displayedResults);
    }
  }, []);

  const listItem = (textValue) => <ListGroup.Item>{textValue}</ListGroup.Item>;
  return (
    <Container>
      <ListGroup>
        {displayedResults.map((item) => listItem(item))}
      </ListGroup>
    </Container>
  );
}
