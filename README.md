# PatentChat
LLM assistanted patent finder backed by Neo4j Graph DB

## Data Cleaning
The scripts used to clean the patent data are stoed in the data cleaning directory. The patent datasets from USPTO from 1980-1992 were cleaned using clean_patents.py. The Stanford network dataset was cleaned using clean_citations.py and process_edges.py.

## Neo
Interactions with the Neo4j Database are stoed in neo. This includes uploading embeddings for each patent as well as vector search in the respective files.

## Frontend
The React frontend is defined in the frontend directory.

## To Run the APP
Cd into the patentui folder and run npm start to start up the UI. Cd into the server and run node index.js to start the node server.
