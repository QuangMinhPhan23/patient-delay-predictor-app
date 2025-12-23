from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
from typing import List, Dict
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="Stacking Model API",
    description="API for predicting delayed assessment using stacking classifier",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://*.ondigitalocean.app",
        "https://ml-web-app-*.ondigitalocean.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
try:
    with open('best_stacking_model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Warning: Model file not found. Please train the model first.")
    model = None
except Exception as e:
    print(f"Warning: Could not load model: {e}")
    print("API will run without model. Please retrain the model with current package versions.")
    model = None

# Define input schema
class PatientData(BaseModel):
    age: float
    addelassess: float
    frailty: float
    cogassess: float
    cogstat: float
    walk: float
    uresidence: float
    ftype: float
    side: float
    afracture: float
    ptype: float
    anaesth: float
    wbear: float
    pulcers: float
    malnutrition: float
    delay: float

class PredictionResponse(BaseModel):
    predicted_class: int
    probabilities: Dict[str, float]
    message: str

def preprocess_features(data: pd.DataFrame) -> pd.DataFrame:
    """Apply the same feature engineering as training"""
    temporal_cols = ['age', 'addelassess', 'frailty', 'cogassess', 'cogstat', 'walk', 'uresidence']
    
    # Create lagged features
    for col in temporal_cols:
        for lag in [1, 2, 3]:
            data[f'{col}_lag_{lag}'] = data[col].shift(lag)
    
    # Create moving averages
    for col in temporal_cols:
        data[f'{col}_ma_3'] = data[col].rolling(window=3).mean()
    
    # Fill NaNs with mean (for single prediction, use 0 for lagged/ma features)
    data = data.fillna(0)
    
    return data

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Stacking Model API",
        "status": "running",
        "model_loaded": model is not None
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(patient: PatientData):
    """Make prediction for a single patient"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Convert input to DataFrame
        input_dict = patient.dict()
        df = pd.DataFrame([input_dict])
        
        # Apply feature engineering
        df_processed = preprocess_features(df)
        
        # Make prediction
        prediction = model.predict(df_processed)[0]
        probabilities = model.predict_proba(df_processed)[0]
        
        # Format response
        prob_dict = {
            f"class_{i}": float(prob) for i, prob in enumerate(probabilities)
        }
        
        return PredictionResponse(
            predicted_class=int(prediction),
            probabilities=prob_dict,
            message="Prediction successful"
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error making prediction: {str(e)}")

@app.post("/predict_batch")
async def predict_batch(patients: List[PatientData]):
    """Make predictions for multiple patients"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Convert inputs to DataFrame
        input_dicts = [patient.dict() for patient in patients]
        df = pd.DataFrame(input_dicts)
        
        # Apply feature engineering
        df_processed = preprocess_features(df)
        
        # Make predictions
        predictions = model.predict(df_processed)
        probabilities = model.predict_proba(df_processed)
        
        # Format response
        results = []
        for i, (pred, probs) in enumerate(zip(predictions, probabilities)):
            prob_dict = {
                f"class_{j}": float(prob) for j, prob in enumerate(probs)
            }
            results.append({
                "patient_index": i,
                "predicted_class": int(pred),
                "probabilities": prob_dict
            })
        
        return {
            "predictions": results,
            "total": len(results),
            "message": "Batch prediction successful"
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error making batch prediction: {str(e)}")

@app.get("/model_info")
async def model_info():
    """Get information about the loaded model"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Load metrics if available
        with open('model_metrics.pkl', 'rb') as f:
            metrics = pickle.load(f)
        
        return {
            "model_type": "Stacking Classifier",
            "base_estimators": ["XGBoost", "RandomForest"],
            "meta_learner": "Logistic Regression",
            "metrics": {
                "accuracy": metrics.get('accuracy'),
                "f1_score": metrics.get('f1_score'),
                "precision": metrics.get('precision'),
                "recall": metrics.get('recall'),
                "log_loss": metrics.get('log_loss'),
                "roc_auc": metrics.get('roc_auc')
            },
            "best_params": metrics.get('best_params')
        }
    except FileNotFoundError:
        return {
            "model_type": "Stacking Classifier",
            "base_estimators": ["XGBoost", "RandomForest"],
            "meta_learner": "Logistic Regression",
            "metrics": "Not available"
        }

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)