import React from "react";
import { RsScrape } from "./component/RsScrape";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import "./App.scss";

export function App() {
  console.log(`api url ${process.env.REACT_APP_API_URL}`);
  const client = new ApolloClient({
    uri: process.env.REACT_APP_API_URL,
    cache: new InMemoryCache(),
  });

  return (
    <>
      <ApolloProvider client={client}>
        <RsScrape />
      </ApolloProvider>
    </>
  );
}
