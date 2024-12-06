import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import QueryInput from "./components/QueryInput";
import ResultsDisplay from "./components/ResultsDisplay";

function App() {
  const [results, setResults] = useState([]);

  // Placeholder function to handle query submission
  const handleQuerySubmit = (query) => {
    console.log("Query submitted:", query);
    // Simulate results for testing
    const simulatedResults = [
      { id: 1, title: "Sample Patent 1", abstract: "Description of Patent 1" },
      { id: 2, title: "Sample Patent 2", abstract: "Description of Patent 2" },
    ];
    setResults(simulatedResults);
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
