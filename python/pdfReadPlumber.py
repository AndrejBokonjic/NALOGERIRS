import sys
import pdfplumber
import pandas as pd
import json
import numpy as np
import re

def clean_cell(cell):
    """Remove the values inside parentheses from a cell"""
    if cell is None:
        return cell
    return re.sub(r'\(.*?\)', '', cell).strip()

def extract_text_from_pdf(file_path):
    tables = []
    excluded_headers = ["SmoothnessofMovements", "Movement plots"]
    graphical_results_variations = [
        "Graphical Results", "GRAPHICAL RESULTS", "Graphical results", "graphical results", 
        "GraphicalResults", "GRAPHICALRESULTS", "Graphicalresults", "graphicalresults"
    ]

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_tables = page.extract_tables()
            for table in page_tables:
                df = pd.DataFrame(table[1:], columns=table[0])
                df = df.replace({np.nan: None})
                columns = df.columns.tolist()
                
                # Check if the table should be excluded
                if any(header in columns for header in excluded_headers):
                    continue

                # Clean the column headers and table cells
                columns = [clean_cell(col) for col in columns]
                df = df.applymap(lambda cell: clean_cell(cell) if isinstance(cell, str) else cell)

                # Check if the table has a header matching any of the variations
                if any(header in columns for header in graphical_results_variations):
                    # Find the index of the matching header
                    header_index = next((columns.index(header) for header in graphical_results_variations if header in columns), None)
                    if header_index is not None:
                        df = df.drop(index=range(header_index, header_index + 3))  # Delete the first three rows after the header
                        df = df.iloc[:-2]  # Delete the last two rows of the entire table
                
                # Find the indices of all cells containing the string "2SD"
                sd_indices = [(i, j) for i in range(len(df)) for j in range(len(df.columns)) if df.iloc[i, j] == '2SD']

                # Delete cells directly below each "2SD" cell
                for i, j in sd_indices:
                    for k in range(i, len(df)): 
                        df.iloc[k, j] = None

                table_data = [columns]
                table_data.extend(df.values.tolist())

                empty_or_none_cell = 0
                value_in_cell = 0
                for row in table_data:
                    for cell in row:
                        if cell == "" or cell is None:
                            empty_or_none_cell += 1
                        else:
                            value_in_cell += 1

                if 2*value_in_cell > empty_or_none_cell:
                    final_table = [row for row in table_data if not all(cell == "" or cell is None for cell in row)]
                    tables.append(final_table)

    return tables

if __name__ == "__main__":
    file_path = sys.argv[1]
    try:
        tables = extract_text_from_pdf(file_path)
        print(json.dumps(tables))
    except Exception as e:
        print(json.dumps({"error": str(e)}))