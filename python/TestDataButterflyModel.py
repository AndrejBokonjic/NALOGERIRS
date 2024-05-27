import pickle
import Orange.data
import pandas as pd

# Load the model correctly
with open('Model Butterfly test.pkcls', 'rb') as model_file:
    model = pickle.load(model_file)

print(type(model))  # <class 'Orange.classification.base_classification.SklModelClassification'>

# Test podatke
input_data = {
    'ToT_e_m': [77.61],
    'ToT_m_m': [48.57],
    'ToT_d_m': [25.63],
    'Und_e_m': [16.49],
    'Und_m_m': [42.52],
    'Und_d_m': [61.91],
    'Over_e_m': [5.91],
    'Over_m_m': [8.93],
    'Over_d_m': [12.46],
    'AA_e_m': [1.26],
    'AA_m_m': [2.30],
    'AA_d_m': [3.47]
}

input_df = pd.DataFrame(input_data)

domain = Orange.data.Domain([Orange.data.ContinuousVariable(name) for name in input_df.columns])

input_table = Orange.data.Table.from_numpy(domain=domain, X=input_df.to_numpy())

predictions = model(input_table)
print(predictions)
