import sys
import pdfplumber
import pandas as pd
import json
import numpy as np

def extract_text_from_pdf(file_path):
    tables = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:

            page_tables = page.extract_tables()
            for table in page_tables:
                df = pd.DataFrame(table[1:], columns=table[0])
                df = df.replace({np.nan: None})
                columns = df.columns.tolist()
                table_data = [columns]
                table_data.extend(df.values.tolist())

                #all_cells=0
                empty_or_none_cell=0
                value_in_cell =0
                for row in table_data:
                    #all_cells += len(row)
                    for cell in row:
                        if cell == "" or cell is None:
                            empty_or_none_cell += 1
                        else:
                            value_in_cell +=1

                # preverimo ali so 50% cells empty or None
                if value_in_cell > empty_or_none_cell :
                    tables.append(table_data)

    return tables

if __name__ == "__main__":
    file_path = sys.argv[1]
    tables = extract_text_from_pdf(file_path)
    print(json.dumps(tables))
