import pytest
import joblib
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

@pytest.fixture(autouse=True, scope="session")
def load_models():
    """Charge le modèle et les encodeurs avant les tests"""
    import backend.main as main
    main.MODEL       = joblib.load("data/models/best_model.pkl")
    main.ENCODER     = joblib.load("data/models/encoders/feature_encoder.pkl")
    main.LABEL_ENC   = joblib.load("data/models/encoders/label_encoder.pkl")
    main.CLASS_ORDER = joblib.load("data/models/encoders/class_order.pkl")
    with open("data/models/model_info.json") as f:
        main.MODEL_INFO = json.load(f)