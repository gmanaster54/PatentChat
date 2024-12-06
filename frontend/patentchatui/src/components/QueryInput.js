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
                console.log('Raw data from backend:', data);
                // Include score in the filtered results
                const filteredResults = data.map((item) => ({
                    TTL: item.TTL || "No Title",
                    PAL: item.PAL || "No Abstract",
                    score: item.score || 0
                }));
                console.log('Filtered Results:', filteredResults);
                onSubmit(filteredResults);
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