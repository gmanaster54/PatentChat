// import React, { useState } from "react";
// import { TextField, Button, Box } from "@mui/material";

// function QueryInput({ onSubmit }) {
//     const [query, setQuery] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('http://localhost:8080/api/query', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ query }),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 console.log(data); // Debug: Log all returned nodes
//                 // Extract only TTL and PAL fields
//                 const filteredResults = data.map(node => {
//                     const { TTL, PAL } = node.properties;
//                     return { TTL, PAL }; // Include only the desired fields
//                 });
//                 onSubmit(filteredResults); // Pass filtered results to the parent
//             } else {
//                 console.error(data.error);
//             }
//         } catch (error) {
//             console.error('Error fetching results:', error);
//         }
//     };

//     return (
//         <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: 2 }}>
//             <TextField
//                 label="Describe your invention idea"
//                 multiline
//                 rows={4}
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Enter your idea here..."
//                 variant="outlined"
//                 fullWidth
//                 sx={{ marginBottom: 2 }}
//             />
//             <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 fullWidth
//             >
//                 Submit
//             </Button>
//         </Box>
//     );
// }

// export default QueryInput;
import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

function QueryInput({ onSubmit }) {
    const [query, setQuery] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!query.trim()) {
            console.error("Query is empty.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Raw data from backend:', data); // Debugging
                // Extract TTL and PAL fields from response
                const filteredResults = data.map((item) => ({
                    TTL: item.TTL || "No Title",
                    PAL: item.PAL || "No Abstract",
                }));
                console.log('Filtered Results:', filteredResults); // Debugging
                onSubmit(filteredResults); // Pass to parent
            } else {
                console.error('Error from server:', data.error);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: 2 }}>
            <TextField
                label="Describe your invention idea"
                multiline
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your idea here..."
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
            >
                Submit
            </Button>
        </Box>
    );
}

export default QueryInput;
