from pydantic import BaseModel

class PredictionRequest(BaseModel):
    feature: float

class PredictionResponse(BaseModel):
    prediction: float
