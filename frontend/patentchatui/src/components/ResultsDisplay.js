import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

function ResultsDisplay({ results }) {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Results
            </Typography>
            {results.length === 0 ? (
                <Typography variant="body1">No results to display.</Typography>
            ) : (
                results.map((result, index) => (
                    <Card key={index} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="body1">
                                <strong>TTL:</strong> {result.TTL || 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <strong>PAL:</strong> {result.PAL || 'N/A'}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
}

export default ResultsDisplay;
