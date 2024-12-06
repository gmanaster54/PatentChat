from sentence_transformers import SentenceTransformer
import neo4j
import sys
import json
from neo_creds import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD

URI = NEO4J_URI
AUTH = (NEO4J_USERNAME, NEO4J_PASSWORD)
DB_NAME = 'neo4j'

def log(message):
    print(message, file=sys.stderr)

def generate_embedding(user_input):
    log(f"\n=== Starting Patent Search ===")
    log(f"User Query: {user_input}")
    log("\nGenerating embedding...")
    
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embedding = model.encode(user_input)
    log(f"Embedding generated with shape: {embedding.shape}")
    return embedding

def find_nearest(embedding, semantic_weight):
    log("\nConnecting to Neo4j database...")
    driver = neo4j.GraphDatabase.driver(URI, auth=AUTH)
    nearest_patents = []
    citation_weight = 1 - semantic_weight

    with driver.session(database=DB_NAME) as session:
        log("Executing vector search query...")
        result = session.run('''
            CALL db.index.vector.queryNodes('patentAbstracts', 5, $queryEmbedding)
            YIELD node, score
            WITH node, score, node.PNO as patentNumber
            MATCH (source)-[edge]->(target)
            WHERE target.PNO = patentNumber 
            WITH node, score, patentNumber, count(edge) as citationCount
            RETURN 
                node.TTL AS TTL, 
                node.PAL AS PAL,
                patentNumber AS PNO,
                score as similarityScore,
                citationCount,
                (score * $semanticWeight + (log(1 + citationCount)/10) * $citationWeight) as combinedScore
            ORDER BY combinedScore DESC
        ''', 
        queryEmbedding=embedding,
        semanticWeight=semantic_weight,
        citationWeight=citation_weight)

        log("\nProcessing results:")
        log("-" * 50)
        for record in result:
            log(f"\nPatent: {record['PNO']}")
            log(f"Title: {record['TTL'][:100]}...")
            log(f"Similarity Score: {record['similarityScore']:.4f}")
            log(f"Citation Count: {record['citationCount']}")
            log(f"Combined Score: {record['combinedScore']:.4f}")
            log("-" * 50)
            
            nearest_patents.append({
                'TTL': record['TTL'], 
                'PAL': record['PAL'],
                'PNO': record['PNO'],
                'similarity_score': record['similarityScore'],
                'citation_count': record['citationCount'],
                'combined_score': record['combinedScore']
            })

    log(f"\nFound {len(nearest_patents)} matching patents")
    return nearest_patents

if __name__ == "__main__":
    try:
        user_input = sys.argv[1]
        semantic_weight = float(sys.argv[2])
        embedding = generate_embedding(user_input)
        nearest_patents = find_nearest(embedding, semantic_weight)

        print(json.dumps(nearest_patents))
        
    except Exception as e:
        log(f"\nERROR: {str(e)}")
        print(json.dumps({"error": str(e)}))
        sys.exit(1)