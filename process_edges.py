import csv

# Define file paths
input_file = "Cit-Patents.txt"
output_file = "citations.csv"

# Initialize list to store edges
edges = []

# Read the input file
with open(input_file, "r") as file:
    for line in file:
        # Ignore comments
        if line.startswith("#"):
            continue
        
        # Split the line into FromNodeId and ToNodeId
        parts = line.strip().split("\t")
        if len(parts) == 2:  # Ensure valid data
            from_node, to_node = parts
            edges.append((from_node, to_node))

# Write to the output CSV file
with open(output_file, "w", newline="") as csvfile:
    # Define headers
    fieldnames = ["FromNodeId", "ToNodeId"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # Write the header
    writer.writeheader()

    # Write rows
    for from_node, to_node in edges:
        writer.writerow({"FromNodeId": from_node, "ToNodeId": to_node})

print(f"Citation data has been processed and saved to {output_file}.")