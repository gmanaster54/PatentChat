import React, { useState } from "react";
import { TextField, Button, Box, Slider, Typography } from "@mui/material";

function QueryInput({ onSubmit }) {
    const [query, setQuery] = useState("");
    const [weightBalance, setWeightBalance] = useState(0.7);

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
                body: JSON.stringify({ query, weightBalance }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Raw data from backend:', data);
                const filteredResults = data.map((item) => ({
                    TTL: item.TTL || "No Title",
                    PAL: item.PAL || "No Abstract",
                    similarity_score: item.similarity_score || 0,
                    citation_count: item.citation_count || 0,
                    combined_score: item.combined_score || 0
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
            <Typography gutterBottom>
                Balance between Semantic Search and Citation Weight
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
                <Slider
                    value={weightBalance}
                    onChange={(e, newValue) => setWeightBalance(newValue)}
                    step={0.1}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => `${(value * 100).toFixed(0)}% Semantic`}
                    marks={[
                        { value: 0, label: '0% Semantic' },
                        { value: 0.5, label: '50%' },
                        { value: 1, label: '100% Semantic' },
                    ]}
                />
            </Box>
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