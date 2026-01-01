import joblib
import os

MODEL_PATH = "model.joblib"

if not os.path.exists(MODEL_PATH):
    from sklearn.linear_model import LinearRegression
    import numpy as np

    X = np.array([[1], [2], [3], [4]])
    y = np.array([2, 4, 6, 8])
    model = LinearRegression()
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)

model = joblib.load(MODEL_PATH)

def predict(value: float) -> float:
    return float(model.predict([[value]])[0])
