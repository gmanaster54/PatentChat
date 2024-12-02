import csv

# Define input and output file paths
input_file = "data/1976.dat"
output_file = "data/cleaned_1976.csv"

# Initialize variables
patents = []  # To store patent data
current_patent = {}  # To store fields for a single patent
within_patn = False  # Flag to indicate we're inside a PATN block

# Open the input file
with open(input_file, "r") as file:
    for line in file:
        # Remove leading/trailing whitespace
        line = line.strip()

        # Start of a new patent block
        if line.startswith("PATN"):
            if current_patent:
                patents.append(current_patent)  # Save the previous patent
            current_patent = {}  # Reset for a new patent
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
                if not line.startswith("PATN"):  # Detect continuation lines (indented or blank start)
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

    # Add the last patent after exiting the loop
    if current_patent:
        patents.append(current_patent)

# Write the extracted data to a CSV file
with open(output_file, "w", newline="") as csvfile:
    fieldnames = ["PNO", "PAL", "NAM", "City", "State", "ISD", "TTL"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # Write header
    writer.writeheader()

    # Write rows
    for patent in patents:
        writer.writerow({key: patent.get(key, "") for key in fieldnames})

print(f"Data has been cleaned and saved to {output_file}.")