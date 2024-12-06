import neo4j
# Wait 60 seconds before connecting using these details, or login to https://console.neo4j.io to validate the Aura Instance is available
URI='neo4j+s://f8c0c7d4.databases.neo4j.io'
NEO4J_USERNAME='neo4j'
NEO4J_PASSWORD='BROm2a3Crv_we46mXAwJdSEGiCAWS49ATD1ixFRpX5Y'
AURA_INSTANCEID='f8c0c7d4'
AURA_INSTANCENAME='Instance01'

AUTH = (NEO4J_USERNAME, NEO4J_PASSWORD)

driver = neo4j.GraphDatabase.driver(URI, auth=AUTH)
driver.verify_connectivity()
print("PASS")