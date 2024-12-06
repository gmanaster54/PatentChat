from sentence_transformers import SentenceTransformer
import neo4j
from neo.neo_creds import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD


URI = NEO4J_URI
AUTH = (NEO4J_USERNAME, NEO4J_PASSWORD)
DB_NAME = 'neo4j'

driver = neo4j.GraphDatabase.driver(URI, auth=AUTH)
driver.verify_connectivity()

model = SentenceTransformer('all-MiniLM-L6-v2')

query_prompt = 'a new type of baseball bat'
query_embedding = model.encode(query_prompt)

related_movies, _, _ = driver.execute_query('''
    CALL db.index.vector.queryNodes('patentAbstracts', 5, $queryEmbedding)
    YIELD node, score
    RETURN node.TTL AS TTL, node.PAL AS PAL, score
    ''', queryEmbedding=query_embedding,
    database_=DB_NAME)
print(f'Patents whose abstract and title relate to `{query_prompt}`:')
for record in related_movies:
    print(record)