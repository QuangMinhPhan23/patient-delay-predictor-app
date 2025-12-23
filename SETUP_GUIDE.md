# ML Model Prediction System

Complete full-stack ML prediction system with FastAPI backend and React frontend.

## 🚀 Quick Start

### 1. Backend Setup (FastAPI)

First, ensure you have trained the model:

```bash
# Train the model (this creates best_stacking_model.pkl)
python model.py
```

Then start the API server:

```bash
# Install backend dependencies (if needed)
pip install fastapi uvicorn[standard]

# Start the FastAPI server
python test.py
```

The API will be available at: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### 2. Frontend Setup (React)

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at: http://localhost:3000

## 📁 Project Structure

```
.
├── model.py                    # Model training script
├── test.py                     # FastAPI backend server
├── test_api.py                 # API testing script
├── requirements.txt            # Python dependencies
├── best_stacking_model.pkl     # Trained model (generated)
├── model_metrics.pkl           # Model metrics (generated)
└── frontend/                   # React frontend
    ├── src/
    │   ├── components/         # React components
    │   ├── lib/               # API client & utilities
    │   ├── App.jsx            # Main app
    │   └── main.jsx           # Entry point
    ├── package.json
    └── vite.config.js
```

## 🎯 Features

### Backend (FastAPI)
- ✅ Single patient prediction endpoint
- ✅ Batch prediction endpoint
- ✅ Model information endpoint
- ✅ Health check endpoint
- ✅ Automatic feature engineering
- ✅ CORS enabled for frontend
- ✅ Interactive API documentation

### Frontend (React)
- ✅ **Single Prediction Dashboard** - Form-based prediction for individual patients
- ✅ **Batch Prediction Dashboard** - JSON upload/paste for multiple predictions
- ✅ **Model Info Dashboard** - View model metrics and architecture
- ✅ Real-time API status monitoring
- ✅ Modern UI with shadcn/ui components
- ✅ Lucide React icons
- ✅ Responsive design
- ✅ Result visualization

## 🔌 API Endpoints

### GET /health
Health check and model status

### POST /predict
Single patient prediction
```json
{
  "age": 75.0,
  "addelassess": 1.0,
  "frailty": 2.0,
  ...
}
```

### POST /predict_batch
Batch predictions (array of patient data)

### GET /model_info
Model metrics and configuration

## 🎨 Frontend Dashboards

### 1. Single Prediction
- Interactive form with all 16 patient features
- Real-time prediction results
- Probability visualization
- Class prediction display

### 2. Batch Prediction
- Upload JSON files
- Paste JSON data
- Load sample data
- Download results
- Process multiple patients at once

### 3. Model Info
- Model architecture details
- Performance metrics (Accuracy, F1, Precision, Recall, etc.)
- Best hyperparameters
- Visual metric representations

## 🛠️ Tech Stack

### Backend
- FastAPI
- Python 3.x
- scikit-learn
- XGBoost
- Pandas
- Uvicorn

### Frontend
- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React
- Axios

## 📊 Usage Examples

### Using the Frontend

1. **Single Prediction:**
   - Navigate to "Single Prediction" tab
   - Fill in all 16 patient features
   - Click "Get Prediction"
   - View predicted class and probabilities

2. **Batch Prediction:**
   - Navigate to "Batch Prediction" tab
   - Click "Load Sample Data" or upload JSON
   - Click "Get Batch Predictions"
   - Download results if needed

3. **Model Info:**
   - Navigate to "Model Info" tab
   - View model architecture
   - Check performance metrics
   - See best parameters

### Using the API Directly

Test the API with curl:

```bash
# Health check
curl http://localhost:8000/health

# Single prediction
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

Or use the provided test script:
```bash
python test_api.py
```

## 🚨 Troubleshooting

**Backend won't start:**
- Make sure model.pkl files exist (run model.py first)
- Check if port 8000 is available
- Install missing dependencies: `pip install -r requirements.txt`

**Frontend won't connect:**
- Verify backend is running on port 8000
- Check browser console for errors
- Ensure CORS is enabled in test.py

**Build errors:**
- Delete node_modules: `rm -rf frontend/node_modules`
- Reinstall: `cd frontend && npm install`

## 📝 Development

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
# Use a production server like Gunicorn
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker test:app
```

## 📄 License

MIT
