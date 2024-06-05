import pdfplumber
import pandas as pd
import json
import numpy as np
import re
import sys


def clean_cell(cell):
    """Remove the values inside parentheses from a cell"""
    if cell is None:
        return cell
    return re.sub(r'\(.*?\)', '', cell).strip()


def remove_signs(cell):
    """Remove % and mm strings from the cell"""
    if cell is None:
        return cell
    cell = re.sub(r'%', '', cell)
    cell = re.sub(r'°', '', cell)
    cell = re.sub(r'\bmm\b', '', cell)
    return cell.strip()


def extract_text_from_pdf(file_path, include_null_tables=False):
    tables = []
    text_data = []
    excluded_headers = ["SmoothnessofMovements", "Movement plots", "Movement Plots"]
    graphical_results_variations = [
        "Graphical Results", "GRAPHICAL RESULTS", "Graphical results", "graphical results",
        "GraphicalResults", "GRAPHICALRESULTS", "Graphicalresults", "graphicalresults", "Graphic Results"
    ]

    # Extract text from the entire PDF to check for "Butterfly-method"
    full_text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            full_text += text
            text_data.append(f"Page {page.page_number} Text:\n{text}\n" + "-" * 80)

    if "Butterfly-method" in full_text or 'The Butterfly Test Report' in full_text:
        # Execute code for Butterfly-method PDFs

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
                    df.columns = columns
                    df = df.applymap(lambda cell: clean_cell(cell) if isinstance(cell, str) else cell)

                    # Check if the table has a header matching any of the variations
                    if any(header in columns for header in graphical_results_variations):
                        # Find the index of the matching header
                        header_index = next(
                            (columns.index(header) for header in graphical_results_variations if header in columns),
                            None)
                        if header_index is not None:
                            df = df.drop(index=range(header_index,
                                                     header_index + 3))  # Delete the first three rows after the header
                            df = df.iloc[:-2]  # Delete the last two rows of the entire table

                    # Find the indices of all cells containing the string "2SD"
                    sd_indices = [(i, j) for i in range(len(df)) for j in range(len(df.columns)) if
                                  df.iloc[i, j] == '2SD']

                    # Delete cells directly below each "2SD" cell
                    for i, j in sd_indices:
                        for k in range(i, len(df)):
                            df.iloc[k, j] = None

                    # Delete rows with None values in '2SD' columns
                    for i, j in sd_indices:
                        for k in range(i, len(df)):
                            df.iloc[k, j] = None

                    # Drop rows and columns where all values are None
                    df.dropna(axis=0, how='all', inplace=True)
                    df.dropna(axis=1, how='all', inplace=True)

                    # Convert DataFrame to a list of lists
                    table_data = [df.columns.tolist()]
                    table_data.extend(df.values.tolist())

                    # Replace values in cells containing "Client performance" or "Average distance" with "-"
                    for i in range(len(table_data)):
                        for j in range(len(table_data[i])):

                            if "Patient performance" in str(table_data[i][j]) or "Average Amplitude Accuracy" in str(
                                    table_data[i][j]):
                                table_data[i][j] = "-"
                            if 'Client performance' in str(table_data[i][j]) or 'Average distance' in str(
                                    table_data[i][j]):
                                table_data[i][j] = "-"

                    # Replace cells containing only "-" with an empty string
                    for i in range(len(table_data)):
                        for j in range(len(table_data[i])):
                            if table_data[i][j] == "-":
                                table_data[i][j] = ""

                    # Move data after "%" sign to the next cell
                    # !!!!!!!!!!!!!!!!!!!!!!!
                    for i in range(len(table_data)):
                        for j in range(len(table_data[i])):
                            if "%" in str(table_data[i][j]):
                                index = str(table_data[i][j]).index("%")
                                if index < len(str(table_data[i][j])) - 1:
                                    table_data[i][j + 1] = str(table_data[i][j])[index + 1:].strip()
                                    table_data[i][j] = str(table_data[i][j])[:index + 1].strip()

                    # Apply the remove_signs function to each cell
                    for i in range(len(table_data)):
                        for j in range(len(table_data[i])):
                            table_data[i][j] = remove_signs(table_data[i][j])

                    if include_null_tables:
                        # Include tables with more null values
                        final_table = [row for row in table_data if not all(cell == "" or cell is None for cell in row)]
                    else:
                        empty_or_none_cell = 0
                        value_in_cell = 0
                        for row in table_data:
                            for cell in row:
                                if cell == "" or cell is None:
                                    empty_or_none_cell += 1
                                else:
                                    value_in_cell += 1

                        if 2 * value_in_cell > empty_or_none_cell:
                            # Remove rows with all empty cells
                            final_table = [row for row in table_data if
                                           not all(cell == "" or cell is None for cell in row)]
                        else:
                            final_table = []

                    # Delete the last three rows if there are more than three rows
                    if len(final_table) > 3:
                        final_table = final_table[:-2]

                    if final_table:
                        tables.append(final_table)
    else:
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
                        header_index = next(
                            (columns.index(header) for header in graphical_results_variations if header in columns),
                            None)
                        if header_index is not None:
                            df = df.drop(index=range(header_index,
                                                     header_index + 3))  # Delete the first three rows after the header
                            df = df.iloc[:-2]  # Delete the last two rows of the entire table

                    # Find the indices of all cells containing the string "2SD"
                    sd_indices = [(i, j) for i in range(len(df)) for j in range(len(df.columns)) if
                                  df.iloc[i, j] == '2SD']

                    # Delete cells directly below each "2SD" cell
                    for i, j in sd_indices:
                        for k in range(i, len(df)):
                            df.iloc[k, j] = None

                    # Delete rows with None values in '2SD' columns
                    for i, j in sd_indices:
                        for k in range(i, len(df)):
                            df.iloc[k, j] = None

                    # Drop rows and columns where all values are None
                    df.dropna(axis=0, how='all', inplace=True)
                    df.dropna(axis=1, how='all', inplace=True)

                    table_data = [df.columns.tolist()]
                    table_data.extend(df.values.tolist())

                    empty_or_none_cell = 0
                    value_in_cell = 0
                    for row in table_data:
                        for cell in row:
                            if cell == "" or cell is None:
                                empty_or_none_cell += 1
                            else:
                                value_in_cell += 1

                    if 2 * value_in_cell > empty_or_none_cell:
                        final_table = [row for row in table_data if not all(cell == "" or cell is None for cell in row)]
                        tables.append(final_table)

    return tables, text_data

if __name__ == "__main__":
    file_path = sys.argv[1]
    include_null_tables = True  # Set to True to include tables with more null values
    try:
        tables, text_data = extract_text_from_pdf(file_path, include_null_tables)
        #for text in text_data:
            #sys.stderr.write(text + "\n")
        print(json.dumps(tables))
    except Exception as e:
        print(json.dumps({"error": str(e)}))