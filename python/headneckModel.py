import sys
import json
import pickle
import Orange.data
import pandas as pd


def load_model(model_path):
    with open(model_path, 'rb') as model_file:
        model = pickle.load(model_file)
    return model

def parse_input_data(input_data):
    parsed_data = json.loads(input_data)
    df = pd.DataFrame(parsed_data)
    return df


def create_orange_table(input_df):
    domain = Orange.data.Domain([Orange.data.ContinuousVariable(name) for name in input_df.columns])
    input_table = Orange.data.Table.from_numpy(domain=domain, X=input_df.to_numpy())
    return input_table

def get_prediction(model, input_table):
    prediction = model(input_table)
    return prediction #.tolist()


def main():
    input_data = sys.argv[1]

    model = load_model("python/MLmodels/ModelHeadNeckRelocationTest.pkcls")

    input_df = parse_input_data(input_data)

    input_table = create_orange_table(input_df)

    prediction = get_prediction(model, input_table)

    print(prediction) # Mislim da lahko brez json.dumps print(json.dumps(predictions))



if __name__ == '__main__':
    main()