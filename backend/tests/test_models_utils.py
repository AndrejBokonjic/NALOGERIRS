# python/tests/test_models_utils.py

import pickle
import pytest

from backend.butterflyModel import load_model as load_butterfly_model
from backend.headneckModel import load_model as load_headneck_model


def test_load_model_butterfly_roundtrip(tmp_path):
    data = {"model": "butterfly", "version": 1}
    model_path = tmp_path / "butterfly.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(data, f)

    loaded = load_butterfly_model(str(model_path))
    assert loaded == data


def test_load_model_headneck_roundtrip(tmp_path):
    data = {"model": "headneck", "version": 1}
    model_path = tmp_path / "headneck.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(data, f)

    loaded = load_headneck_model(str(model_path))
    assert loaded == data


def test_load_model_raises_for_missing_file(tmp_path):
    missing = tmp_path / "missing.pkl"
    with pytest.raises(FileNotFoundError):
        load_butterfly_model(str(missing))
