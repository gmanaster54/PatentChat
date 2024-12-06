from sentence_transformers import SentenceTransformer
import neo4j
from frontend.server.neo_creds import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD

URI = NEO4J_URI
AUTH = (NEO4J_USERNAME, NEO4J_PASSWORD)
DB_NAME = 'neo4j'


def main():
    driver = neo4j.GraphDatabase.driver(URI, auth=AUTH)
    driver.verify_connectivity()

    model = SentenceTransformer('all-MiniLM-L6-v2')  # vector size 384

    batch_size = 100
    batch_n = 1
    patents_with_embeddings = []
    with driver.session(database=DB_NAME) as session:
        # Fetch `Patent` nodes
        result = session.run('MATCH (p:Patent) RETURN p.PAL AS PAL, p.TTL AS TTL')
        for record in result:
            title = record.get('TTL')
            abstract = record.get('PAL')

            # Create embedding for title and abstract
            if title is not None and abstract is not None:
                patents_with_embeddings.append({
                    'TTL': title,
                    'PAL': abstract,
                    'embedding': model.encode(f'''
                        TTL: {title}\n
                        PAL: {abstract}
                    '''),
                })

            # Import when a batch of patents has embeddings ready; flush buffer
            if len(patents_with_embeddings) == batch_size:
                import_batch(driver, patents_with_embeddings, batch_n)
                patents_with_embeddings = []
                batch_n += 1

    # Import complete, show counters
    records, _, _ = driver.execute_query('''
    MATCH (p:Patent WHERE p.embedding IS NOT NULL)
    RETURN count(*) AS countPatentsWithEmbeddings, size(p.embedding) AS embeddingSize
    ''', database_=DB_NAME)

    print(f"""
Embeddings generated and attached to nodes.
Patent nodes with embeddings: {records[0].get('countPatentsWithEmbeddings')}.
Embedding size: {records[0].get('embeddingSize')}.
    """)


def import_batch(driver, nodes_with_embeddings, batch_n):
    # Add embeddings to Patent nodes
    driver.execute_query('''
    UNWIND $patents as patent
    MATCH (p:Patent {TTL: patent.TTL, PAL: patent.PAL})
    CALL db.create.setNodeVectorProperty(p, 'embedding', patent.embedding)
    ''', patents=nodes_with_embeddings, database_=DB_NAME)
    print(f'Processed batch {batch_n}.')


if __name__ == '__main__':
    main()

'''
Patent nodes with embeddings: 100000.
Embedding size: 384.
'''