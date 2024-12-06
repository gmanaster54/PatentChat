import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import QueryInput from "./components/QueryInput";
import ResultsDisplay from "./components/ResultsDisplay";

function App() {
  const [results, setResults] = useState([]);

  // Handle query results
  const handleQuerySubmit = (newResults) => {
    setResults(newResults); // Set the results array with all nodes
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        PatentChat
      </Typography>
      <QueryInput onSubmit={handleQuerySubmit} />
      <ResultsDisplay results={results} />
    </Container>
  );
}

export default App;
