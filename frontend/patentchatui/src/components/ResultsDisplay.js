// import React from "react";
// import { Card, CardContent, Typography, Box } from "@mui/material";

// function ResultsDisplay({ results }) {
//     return (
//         <Box>
//             <Typography variant="h5" gutterBottom>
//                 Results
//             </Typography>
//             {results.length === 0 ? (
//                 <Typography variant="body1">No results to display.</Typography>
//             ) : (
//                 results.map((result, index) => (
//                     <Card key={index} sx={{ marginBottom: 2, padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 <strong>Title:</strong> {result.TTL || 'N/A'}
//                             </Typography>
//                             <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
//                                 <strong>Abstract:</strong> {result.PAL || 'N/A'}
//                             </Typography>
//                         </CardContent>
//                     </Card>
//                 ))
//             )}
//         </Box>
//     );
// }

// export default ResultsDisplay;
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
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                                <strong>Abstract:</strong> {result.PAL}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
}

export default ResultsDisplay;
