import io
import joblib
import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from features.preprocess import standardize_image
from features.extract import extract_features
from utils.validation import validate_image

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

model = joblib.load("model/model (2).pkl")

@app.get("/")
async def root():
    return {"message": "Welcome to Veripixel AI Image Detector API"}

@app.post("/predict")
@limiter.limit("5/minute")
async def predict(request: Request, image: UploadFile = File(...)):
    file_bytes = await image.read()

    if not validate_image(file_bytes):
        return {"error": "Invalid image"}

    npimg = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    img = standardize_image(img)
    features = extract_features(img).reshape(1, -1)

    prob_ai = float(model.predict_proba(features)[0][1])

    if prob_ai > 0.51:
        decision = "Likely AI-generated"
    elif prob_ai < 0.45:
        decision = "Likely Real"
    else:
        decision = "Uncertain"

    return {
        "ai_probability": round(prob_ai, 3),
        "decision": decision,
        "note": "Result is probabilistic, not definitive"
    }
