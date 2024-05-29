import Orange.data
import pickle
import joblib

with open('ModelButterflyTest.pkcls', 'rb') as model_file:
    model = pickle.load(model_file)

joblib.dump(model, 'python/MLmodels/ModelButterflyTest.joblib')

