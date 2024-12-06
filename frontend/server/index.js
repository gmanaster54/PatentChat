const express = require('express');
const cors = require('cors');
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
        const pythonProcess = spawn('python', ['vector_search.py', userInput]);

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