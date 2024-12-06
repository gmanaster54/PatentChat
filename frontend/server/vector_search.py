from sentence_transformers import SentenceTransformer
import neo4j
from neo_creds import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD
import sys
import json

URI = NEO4J_URI
AUTH = (NEO4J_USERNAME, NEO4J_PASSWORD)
DB_NAME = 'neo4j'

def generate_embedding(user_input):

    model = SentenceTransformer('all-MiniLM-L6-v2')

    query_embedding = model.encode(user_input)

    return query_embedding

def find_nearest(embedding):
    driver = neo4j.GraphDatabase.driver(URI, auth=AUTH)
    driver.verify_connectivity()

    nearest_patents = []

    related_patents, _, _ = driver.execute_query('''
        CALL db.index.vector.queryNodes('patentAbstracts', 5, $queryEmbedding)
        YIELD node, score
        RETURN node.TTL AS TTL, node.PAL AS PAL, score
        ''', queryEmbedding=embedding,
        database_=DB_NAME)
    
    for record in related_patents:
        nearest_patents.append({'TTL': record[0], 'PAL': record[1]})

    return nearest_patents

if __name__ == "__main__":
    # Read input from Node.js
    user_input = sys.argv[1]  # The second argument is the userInput passed from server.js
    
    # Generate embedding
    embedding = generate_embedding(user_input)
    # print(embedding)
    # Return the embedding as a JSON string
    nearest_patents = find_nearest(embedding)

    print(json.dumps(nearest_patents))
