import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

function ResultsDisplay({ results }) {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Search Results
            </Typography>
            {results.length === 0 ? (
                <Typography variant="body1">No results to display.</Typography>
            ) : (
                results.map((result) => (
                    <Card key={result.id} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{result.title}</Typography>
                            <Typography variant="body2">{result.abstract}</Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
}

export default ResultsDisplay;
