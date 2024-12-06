import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

function QueryInput({ onSubmit }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSubmit(query);
            setQuery(""); // Clear the input after submission
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