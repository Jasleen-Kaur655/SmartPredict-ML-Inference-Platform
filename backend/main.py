from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import PredictionRequest, PredictionResponse
from backend.model import predict
from backend.logger import get_logger

app = FastAPI(title="ML Inference API")
logger = get_logger()

# ✅ ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token != "mysecrettoken":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return "authenticated_user"

@app.get("/")
def root():
    return {"message": "ML Inference API is running"}

@app.post("/predict", response_model=PredictionResponse)
def make_prediction(
    data: PredictionRequest,
    user: str = Depends(verify_token)
):
    logger.info(f"Prediction requested by {user}")
    result = predict(data.feature)
    return {"prediction": result}
