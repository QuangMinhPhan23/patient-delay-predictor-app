# Stacking Model API

FastAPI application for serving the trained stacking classifier model.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure you have trained the model first (run model.py):
```bash
python model.py
```
This will create `best_stacking_model.pkl` and `model_metrics.pkl`

## Running the API

Start the FastAPI server:
```bash
python api.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Interactive API docs**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## Endpoints

### 1. Health Check
```bash
GET /health
```

### 2. Single Prediction
```bash
POST /predict
```

**Request body:**
```json
{
  "age": 75.0,
  "addelassess": 1.0,
  "frailty": 2.0,
  "cogassess": 1.0,
  "cogstat": 1.0,
  "walk": 2.0,
  "uresidence": 1.0,
  "ftype": 1.0,
  "side": 2.0,
  "afracture": 1.0,
  "ptype": 1.0,
  "anaesth": 1.0,
  "wbear": 1.0,
  "pulcers": 1.0,
  "malnutrition": 1.0,
  "delay": 1.0
}
```

**Response:**
```json
{
  "predicted_class": 1,
  "probabilities": {
    "class_0": 0.25,
    "class_1": 0.55,
    "class_2": 0.20
  },
  "message": "Prediction successful"
}
```

### 3. Batch Prediction
```bash
POST /predict_batch
```

**Request body:** Array of patient data objects

### 4. Model Information
```bash
GET /model_info
```

Returns model metrics and configuration.

## Testing

Run the test client:
```bash
python test_api.py
```

This will test all endpoints and display results.

## cURL Examples

**Health check:**
```bash
curl http://localhost:8000/health
```

**Single prediction:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 75.0,
    "addelassess": 1.0,
    "frailty": 2.0,
    "cogassess": 1.0,
    "cogstat": 1.0,
    "walk": 2.0,
    "uresidence": 1.0,
    "ftype": 1.0,
    "side": 2.0,
    "afracture": 1.0,
    "ptype": 1.0,
    "anaesth": 1.0,
    "wbear": 1.0,
    "pulcers": 1.0,
    "malnutrition": 1.0,
    "delay": 1.0
  }'
```

## Features

- ✅ Single and batch predictions
- ✅ Automatic feature engineering (lagged features and moving averages)
- ✅ Model metrics and information endpoint
- ✅ Interactive API documentation
- ✅ Error handling and validation
- ✅ Health check endpoint
