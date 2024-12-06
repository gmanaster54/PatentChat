import csv

# Define file paths
node_ids_file = "data/node_ids.txt"
citations_file = "data/cit-Patents.txt"
output_file = "data/filtered_citations.csv"

# Load node IDs into a set for quick lookup
print("Loading node IDs...")
with open(node_ids_file, "r") as file:
    node_ids = set(line.strip() for line in file)

print(f"Loaded {len(node_ids)} unique node IDs.")

# Initialize a list for filtered citations
filtered_citations = []

# Process the citations file
print("Processing citations...")
with open(citations_file, "r") as file:
    for line in file:
        # Skip comment lines
        if line.startswith("#"):
            continue
        
        # Parse FromNodeId and ToNodeId
        parts = line.strip().split("\t")
        if len(parts) == 2:
            from_node, to_node = parts
            # Only include lines where both nodes are in node_ids
            if from_node in node_ids and to_node in node_ids:
                filtered_citations.append((from_node, to_node))

print(f"Filtered {len(filtered_citations)} valid citations.")
print("Writing filtered citations to CSV..")
with open(output_file, "w", newline="") as csvfile:
    fieldnames = ["FromNodeID", "ToNodeID"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # Write header
    writer.writeheader()

    # Write rows
    for from_node, to_node in filtered_citations:
        writer.writerow({"FromNodeID": from_node, "ToNodeID": to_node})

print(f"Filtered citations saved to {output_file}.")