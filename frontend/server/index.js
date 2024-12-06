// const express = require('express');
// const neo4j = require('neo4j-driver');
// const cors = require('cors'); // Import CORS
// const { spawn } = require('child_process');

// require('dotenv').config();


// // Load environment variables
// NEO4J_URI = 'neo4j+s://f8c0c7d4.databases.neo4j.io'
// NEO4J_USERNAME = 'neo4j'
// NEO4J_PASSWORD = 'BROm2a3Crv_we46mXAwJdSEGiCAWS49ATD1ixFRpX5Y'

// // Set up Neo4j driver
// const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
// const session = driver.session();

// // Create an Express app
// const app = express();
// app.use(cors({ origin: 'http://localhost:3000' })); // Enable CORS

// app.use(express.json());


// // Middleware to parse JSON request bodies
// app.use(express.json());

// // API endpoint to handle patent query
// // app.post('/api/query', async (req, res) => {
// //     try {

// //         const userInput = req.body.query;
// //         console.log(userInput);

// //         const pythonProcess = spawn('python3', ["vector_search.py", userInput]);
// //         let output = "";
// //         pythonProcess.stdout.on('data', (data) => {
// //             output += data.toString();
// //         });
// //         console.log(output);
// //         pythonProcess.stderr.on('data', (data) => {
// //             console.error(`stderr: ${data}`);
// //         });

// //         pythonProcess.on('close', (code) => {
// //             if (code !== 0) {
// //                 res.json({ embedding: JSON.parse(output) });
// //             } else {
// //                 res.status(500).json({ error: 'Error generating embedding.' });
// //             }
// //         });
// //     } catch (error) {
// //         console.error('Error handling request:', error);
// //         res.status(500).json({ error: 'An error occurred while processing the request.' });
// //     });
// app.post('/api/query', async (req, res) => {
//     try {
//         const userInput = req.body.query;
//         console.log('User input:', userInput);

//         // Run the Python process
//         const pythonProcess = spawn('python3', ['vector_search.py', userInput]);

//         let pythonOutput = '';
//         pythonProcess.stdout.on('data', (data) => {
//             pythonOutput += data.toString();
//         });
//         console.log(pythonOutput);

//         pythonProcess.stderr.on('data', (data) => {
//             console.error(`Python error: ${data}`);
//         });

//         pythonProcess.on('close', async (code) => {
//             if (code !== 0) {
//                 return res.status(500).json({ error: 'Error generating embedding.' });
//             }

//         });
//     } catch (error) {
//         console.error('Error handling request:', error);
//         res.status(500).json({ error: 'An error occurred while processing the request.' });
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// // Close the Neo4j session on process exit
// process.on('SIGINT', async () => {
//     await session.close();
//     await driver.close();
//     process.exit(0);
// });
const express = require('express');
const cors = require('cors'); // Import CORS
const { spawn } = require('child_process');
require('dotenv').config();

// Create an Express app
const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Enable CORS
app.use(express.json()); // Middleware to parse JSON request bodies

// API endpoint to handle patent query
app.post('/api/query', (req, res) => {
    try {
        const userInput = req.body.query; // Get the query from the frontend
        console.log('User input:', userInput);

        // Spawn the Python process
        const pythonProcess = spawn('python3', ['vector_search.py', userInput]);

        let pythonOutput = '';
        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString(); // Collect output from Python script
        });
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    // Parse the Python output and send it to the frontend
                    const nearestPatents = JSON.parse(pythonOutput);
                    console.log('Nearest patents:', nearestPatents);
                    res.status(200).json(nearestPatents);
                } catch (error) {
                    console.error('Error parsing Python output:', error);
                    res.status(500).json({ error: 'Invalid output from Python script.' });
                }
            } else {
                res.status(500).json({ error: 'Python process failed.' });
            }
        });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

