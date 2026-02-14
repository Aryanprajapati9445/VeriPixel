import io
import joblib
import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from features.preprocess import standardize_image
from features.extract import extract_features
from utils.validation import validate_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

model = joblib.load("model/model (2).pkl")

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
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
