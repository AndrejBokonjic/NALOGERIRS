import sys
import pdfplumber
import pandas as pd
import json
import numpy as np
import re

def clean_cell(cell):

    if cell is None:
        return cell
    return re.sub(r'\(.*?\)', '', cell).strip()

def extract_text_from_pdf(file_path):
    tables = []
    excluded_headers = ["SmoothnessofMovements", "Movement plots"]

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_tables = page.extract_tables()
            for table in page_tables:
                df = pd.DataFrame(table[1:], columns=table[0])
                df = df.replace({np.nan: None})
                columns = df.columns.tolist()
                

                if any(header in columns for header in excluded_headers):
                    continue


                columns = [clean_cell(col) for col in columns]
                df = df.applymap(lambda cell: clean_cell(cell) if isinstance(cell, str) else cell)

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


                if value_in_cell > empty_or_none_cell:

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