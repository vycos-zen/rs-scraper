import React, { useState } from "react";
import { RsScrapeInput } from "./component/RsScrapeInput";
import { RsScrapeResults } from "./component/RsScrapeResults";
import { Container } from "react-bootstrap";
import "./App.scss";

export function App() {
  const [results, setResults] = useState([]);

  const refreshResults = () => {
    return ["buzz", "fizz buzz"];
  };

  return (
    <Container>
      <RsScrapeInput props={refreshResults} />
      <br />
      <RsScrapeResults props={{ results: ["fizz", "buzz"] }} />
    </Container>
  );
}
