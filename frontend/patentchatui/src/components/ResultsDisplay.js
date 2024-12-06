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
                    <Card
                        key={index}
                        sx={{
                            marginBottom: 2,
                            padding: 2,
                            border: '1px solid #ddd',
                            borderRadius: 2,
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <strong>Title:</strong> {result.TTL}
                            </Typography>
                            <Typography
                                variant="body2"
                                style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}
                            >
                                <strong>Abstract:</strong> {result.PAL}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                <strong>Semantic Score:</strong> {(result.similarity_score * 100).toFixed(2)}%
                                <br />
                                <strong>Citations:</strong> {result.citation_count}
                                <br />
                                <strong>Combined Score:</strong> {(result.combined_score * 100).toFixed(2)}%
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
}

export default ResultsDisplay;