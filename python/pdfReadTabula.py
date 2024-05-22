import sys
import pdfplumber
import tabula
import pandas as pd
import json
import numpy as np


# def extract_text_from_pdf(file_path):
#     with pdfplumber.open(file_path) as pdf:
#         text = ''
#         for page in pdf.pages:
#             text += page.extract_text()
#     return text

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

    # Print tables
    # for i, df in enumerate(dfs):
    #    print(f"Table {i + 1}:\n", df, "\n")


#         tables = []
#             for i, df in enumerate(dfs):
#                 tables.append(df.to_json(orient='split'))  # Convert each table to JSON
#
#             return tables


# print("get")
# return df #display(df.head()) df


if __name__ == "__main__":
    file_path = sys.argv[1]
    # print(file_path)

    # extract_text_from_pdf(file_path) #extracted_text = extract_text_from_pdf(file_path)
    # print(extracted_text)

    tables = extract_text_from_pdf(file_path)
    # print(json.dumps(tables))

    print(json.dumps(tables))

    # print(json.dumps(tables))
