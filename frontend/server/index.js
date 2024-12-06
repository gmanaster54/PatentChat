const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/query', (req, res) => {
    try {
        const userInput = req.body.query;
        const weightBalance = req.body.weightBalance;
        console.log('User input:', userInput);
        console.log('Weight balance:', weightBalance);

        const pythonProcess = spawn('python', [
            'vector_search.py',
            userInput,
            weightBalance.toString()
        ]);

        let pythonOutput = '';
        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});