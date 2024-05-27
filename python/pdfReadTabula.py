import sys
import pdfplumber
import tabula
import pandas as pd
import json
import numpy as np

def extract_text_from_pdf(file_path):
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', 1200)

    dfs = tabula.read_pdf(file_path, pages='all', multiple_tables=True)

    tables = []
    for df in dfs:
        df = df.replace({np.nan: None})

        columns = df.columns.tolist()
        table_data = [columns]
        table_data.extend(df.values.tolist())
        tables.append(table_data)

    return tables

if __name__ == "__main__":
    file_path = sys.argv[1]

    tables = extract_text_from_pdf(file_path)

    print(json.dumps(tables))