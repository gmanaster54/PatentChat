from neo4j import GraphDatabase

# Connect to the database
uri = "bolt://localhost:7687"
username = "neo4j"
password = "neo4j"
driver = GraphDatabase.driver(uri, auth=(username, password))

# Define a function to load data
def create_patent(tx, patent_id, title, abstract, description, filing_date, vector_embedding):
    query = """
    CREATE (p:Patent {
        patent_id: $patent_id,
        title: $title,
        abstract: $abstract,
        description: $description,
        filing_date: $filing_date,
        vector_embedding: $vector_embedding
    })
    """
    tx.run(query, patent_id=patent_id, title=title, abstract=abstract,
           description=description, filing_date=filing_date, vector_embedding=vector_embedding)

# Add data to Neo4j
with driver.session() as session:
    session.write_transaction(create_patent, "US1234567A", "Innovative Widget",
                              "A widget that improves efficiency.",
                              "Details about the widget.", "2023-01-01", [0.1, 0.2, 0.3, 0.4])