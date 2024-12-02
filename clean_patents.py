import os
import csv

# Define the input directory and output file paths
input_directory = "data"
output_file = "data/cleaned_patents.csv"

patents = []  # To store valid patent data
node_ids = set()  # To store all unique PNOs (patent IDs)
max_patents = 100000  # Limit the number of patents to process to fit into Neo4j
processed_patents = 0  # Counter for processed patents

def is_valid_pno(pno):
    """
    Validate the PNO by removing commas, stripping leading zeros,
    and ensuring it is a 7-digit number between 4000000 and 4900000.
    """
    # Remove commas and strip leading zeros
    pno = pno.replace(",", "").lstrip("0")
    if pno.isdigit() and 4000000 <= int(pno) <= 5000000:
        return pno
    return None

# Process all files in the input directory
for filename in os.listdir(input_directory):
    if filename.endswith(".dat"):
        input_file = os.path.join(input_directory, filename)
        print(f"Processing file: {input_file}")
        
        # Read and process the file
        with open(input_file, "r") as file:
            current_patent = {}
            within_patn = False
            reading_pal = False
            
            try:
                for line in file:
                    # Remove leading/trailing whitespace
                    line = line.strip()

                    # Start of a new patent block
                    if line.startswith("PATN"):
                        if current_patent:
                            # Only save if all fields are present and PNO is valid
                            if all(key in current_patent for key in ["PNO", "PAL", "NAM", "City", "State", "ISD", "TTL"]):
                                valid_pno = is_valid_pno(current_patent["PNO"])
                                if valid_pno:
                                    current_patent["PNO"] = valid_pno  # Update to valid PNO
                                    patents.append(current_patent)
                                    node_ids.add(valid_pno)  # Add valid PNO to node IDs
                                    processed_patents += 1
                            current_patent = {}  # Reset for a new patent
                            if len(node_ids) >= max_patents:
                                break

                        within_patn = True
                        reading_pal = False

                    # Parse fields only within a PATN block
                    if within_patn:
                        if line.startswith("PNO") and "PNO" not in current_patent:
                            current_patent["PNO"] = line[4:].strip()  # Primary patent number
                        elif line.startswith("TTL"):
                            current_patent["TTL"] = line[4:].strip()  # Title
                        elif line.startswith("PAL"):
                            current_patent["PAL"] = line[4:].strip()  # Start of the abstract
                            reading_pal = True  # Set the PAL flag
                        elif reading_pal:
                            # Append to PAL if the line does not have a label
                            if not line.startswith("PATN") and not line.startswith("PNO"):
                                current_patent["PAL"] += " " + line.strip()
                            else:
                                reading_pal = False  # End PAL if a labeled field starts
                        elif line.startswith("NAM") and "NAM" not in current_patent:
                            current_patent["NAM"] = line[4:].strip()  # First inventor's name
                        elif line.startswith("CTY") and "City" not in current_patent:
                            current_patent["City"] = line[4:].strip()  # City
                        elif line.startswith("STA") and "State" not in current_patent:
                            current_patent["State"] = line[4:].strip()  # State
                        elif line.startswith("ISD") and "ISD" not in current_patent:
                            current_patent["ISD"] = line[4:].strip()  # Issue date
            except Exception as e:
                pass
            # Add the last patent after exiting the loop
            if current_patent and all(key in current_patent for key in ["PNO", "PAL", "NAM", "City", "State", "ISD", "TTL"]):
                valid_pno = is_valid_pno(current_patent["PNO"])
                if valid_pno:
                    current_patent["PNO"] = valid_pno  # Update to valid PNO
                    patents.append(current_patent)
                    node_ids.add(valid_pno)
                    processed_patents += 1
            if processed_patents >= max_patents:
                print("Reached the limit of processed patents.")
                break
        
        if processed_patents >= max_patents:
            break

# Write the extracted data to a single CSV file
with open(output_file, "w", newline="") as csvfile:
    fieldnames = ["PNO", "PAL", "NAM", "City", "State", "ISD", "TTL"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # Write header
    writer.writeheader()

    # Write rows
    for patent in patents:
        writer.writerow({key: patent.get(key, "") for key in fieldnames})

# Save unique NodeIDs to a separate file for reference
node_ids_file = "data/node_ids.txt"
with open(node_ids_file, "w") as node_file:
    for node_id in sorted(node_ids):  # Sort for consistency
        node_file.write(f"{node_id}\n")

print(f"Processed {processed_patents} patents.")
print(f"Cleaned data saved to {output_file}.")
print(f"Unique Node IDs saved to {node_ids_file}.")