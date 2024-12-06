import neo4j
# Wait 60 seconds before connecting using these details, or login to https://console.neo4j.io to validate the Aura Instance is available
URI=''
NEO4J_USERNAME=''
NEO4J_PASSWORD=''
AURA_INSTANCEID=''
AURA_INSTANCENAME=''

AUTH = (NEO4J_USERNAME, NEO4J_PASSWORD)

driver = neo4j.GraphDatabase.driver(URI, auth=AUTH)
driver.verify_connectivity()
print("PASS")