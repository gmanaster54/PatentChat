const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors'); // Import CORS

require('dotenv').config();


// Load environment variables
NEO4J_URI = 'neo4j+s://f8c0c7d4.databases.neo4j.io'
NEO4J_USERNAME = 'neo4j'
NEO4J_PASSWORD = 'BROm2a3Crv_we46mXAwJdSEGiCAWS49ATD1ixFRpX5Y'

// Set up Neo4j driver
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const session = driver.session();

// Create an Express app
const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Enable CORS

app.use(express.json());


// Middleware to parse JSON request bodies
app.use(express.json());

// API endpoint to handle patent query
app.post('/api/query', async (req, res) => {
    try {
        // Test connectivity with a simple query
        const result = await session.run(
            `
            MATCH (n) RETURN n LIMIT 3
            `
        );

        // Map the result to extract properties of the node
        const nodes = result.records.map((record) => {
            const node = record.get('n'); // Get the node from the record
            return {
                id: node.identity.low, // Neo4j internal node ID
                labels: node.labels, // Labels of the node (e.g., :Person, :Patent)
                properties: node.properties, // All properties of the node
            };
        });
        console.log(nodes);
        res.status(200).json(nodes);
    } catch (error) {
        console.error('Error querying Neo4j:', error);
        res.status(500).json({ error: 'An error occurred while querying the database.' });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Close the Neo4j session on process exit
process.on('SIGINT', async () => {
    await session.close();
    await driver.close();
    process.exit(0);
});

