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

def is_relevant_row(row):
    """Determine if the row is relevant based on its content"""
    irrelevant_keywords = [
        "Client performance relative to normative range", 
        "SmoothnessofMovements", 
        "Movement plots"
    ]
    return not any(keyword in str(cell) for cell in row for keyword in irrelevant_keywords)

def extract_text_from_pdf(file_path):
    tables = []
    
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_tables = page.extract_tables()
            for table in page_tables:
                if table:  # Ensure the table is not empty
                    df = pd.DataFrame(table[1:], columns=table[0])
                    df = df.replace({np.nan: None})
                    columns = df.columns.tolist()
                    
                    # Clean the column headers and table cells
                    columns = [clean_cell(col) for col in columns]
                    df = df.applymap(lambda cell: clean_cell(cell) if isinstance(cell, str) else cell)

                    # Find the indices of all cells containing the string "2SD"
                    sd_indices = [(i, j) for i in range(len(df)) for j in range(len(df.columns)) if df.iloc[i, j] == '2SD']

                    # Delete cells directly below each "2SD" cell
                    for i, j in sd_indices:
                        for k in range(i, len(df)): 
                            df.iloc[k, j] = None

                    table_data = [columns]
                    table_data.extend(df.values.tolist())

                    # Filter out irrelevant rows
                    filtered_table_data = [row for row in table_data if is_relevant_row(row)]
                    
                    # Remove rows that contain only "Easy", "Medium", "Difficult" with no other data
                    filtered_table_data = [row for row in filtered_table_data if not (all(cell in ["Easy", "Medium", "Difficult", None, ""] for cell in row) and any(cell in ["Easy", "Medium", "Difficult"] for cell in row))]

                    # Filter out empty or mostly empty tables
                    non_empty_rows = [row for row in filtered_table_data if any(cell for cell in row)]
                    if non_empty_rows:
                        tables.append(non_empty_rows)

    return tables

if __name__ == "__main__":
    file_path = sys.argv[1]
    try:
        tables = extract_text_from_pdf(file_path)
        print(json.dumps(tables))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
