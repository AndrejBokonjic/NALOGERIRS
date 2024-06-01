import sys
import json
import pickle
import Orange.data
import pandas as pd

from ButterflyTestPDF import create_butterfly_pdf

def load_model(model_path):
    with open(model_path, 'rb') as model_file:
        model = pickle.load(model_file)
    return model

def parse_input_data(input_data):
    parsed_data = json.loads(input_data)
    df = pd.DataFrame(parsed_data)
    return df

    #...
    #     'ToT_e_m': [77.61],
    #         'ToT_m_m': [48.57],
    #         'ToT_d_m': [25.63],
    #         'Und_e_m': [16.49],
    #         'Und_m_m': [42.52],
    #         'Und_d_m': [61.91],
    #         'Over_e_m': [5.91],
    #         'Over_m_m': [8.93],
    #         'Over_d_m': [12.46],
    #         'AA_e_m': [1.26],
    #         'AA_m_m': [2.30],
    #         'AA_d_m': [3.47]
    # POMEMBAN JE VRSTNI RED
    # napoved: .3 (pomeni 4 cluster, ker zacne iz 0)

def create_orange_table(input_df):
    domain = Orange.data.Domain([Orange.data.ContinuousVariable(name) for name in input_df.columns])
    input_table = Orange.data.Table.from_numpy(domain=domain, X=input_df.to_numpy())
    return input_table

def get_prediction(model, input_table):
    prediction = model(input_table)
    return prediction #.tolist()


def main():
    input_data = sys.argv[1]
    filePathToSave = sys.argv[2]

    model = load_model("python/MLmodels/ModelButterflyTest.pkcls")

    input_df = parse_input_data(input_data)

    input_table = create_orange_table(input_df)

    prediction = get_prediction(model, input_table)

    # CREATE BUTTERFLY PDF
    # Rabim input_data, napoved in ime pacienta
    pdf_base64_string = create_butterfly_pdf(input_data, prediction[0], "Boban Boshevski", filePathToSave)

    #print(prediction) # Mislim da lahko brez json.dumps print(json.dumps(predictions))

    print(pdf_base64_string)


if __name__ == '__main__':
    main()



