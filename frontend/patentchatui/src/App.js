// import React, { useState } from "react";
// import { Container, Typography } from "@mui/material";
// import QueryInput from "./components/QueryInput";
// import ResultsDisplay from "./components/ResultsDisplay";

// function App() {
//   const [results, setResults] = useState([]);

//   const handleQuerySubmit = (newResults) => {
//     console.log('Received results:', newResults); // Debugging
//     setResults(newResults); // Update state
//   };

//   return (
//     <Container maxWidth="md" style={{ marginTop: "20px" }}>
//       <Typography variant="h4" gutterBottom>
//         PatentChat
//       </Typography>
//       <QueryInput onSubmit={handleQuerySubmit} />
//       <ResultsDisplay results={results} />
//     </Container>
//   );
// }

// export default App;

import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import QueryInput from "./components/QueryInput";
import ResultsDisplay from "./components/ResultsDisplay";

function App() {
  const [results, setResults] = useState([]);

  const handleQuerySubmit = (newResults) => {
    console.log('Results passed to App:', newResults); // Debugging
    setResults(newResults); // Update state
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
