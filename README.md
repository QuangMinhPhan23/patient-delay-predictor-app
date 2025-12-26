# Healthcare Assessment Delay Predictor

A full-stack machine learning web application for predicting patient assessment delays using stacking ensemble classifiers. Built with React frontend and FastAPI backend, featuring automated hyperparameter tuning with Optuna.

## 🎯 Overview

This application predicts healthcare assessment delays (delassess) for patients using an optimized stacking classifier combining XGBoost and Random Forest with a Logistic Regression meta-learner. The model achieves robust performance through temporal feature engineering and Optuna-based hyperparameter optimization.

## 📸 Screenshots

<img width="1798" height="782" alt="image" src="https://github.com/user-attachments/assets/a6590435-3bd2-4a19-8c06-6ef398fe8936" />
<img width="1849" height="811" alt="image" src="https://github.com/user-attachments/assets/ea483c32-2c1b-4d49-9750-c068aa17486d" />
<img width="1837" height="852" alt="image" src="https://github.com/user-attachments/assets/2bf42096-ff2b-4d92-9a3d-476392b8d176" />
<img width="1837" height="809" alt="image" src="https://github.com/user-attachments/assets/354fd52b-fce4-4f76-8c11-1f98f46865b3" />
<img width="1809" height="870" alt="image" src="https://github.com/user-attachments/assets/5c6929f7-ba09-4838-b78f-c36d198dcc49" />

## 📊 Model Information

### Architecture
- **Base Models**: XGBoost, Random Forest
- **Meta-learner**: Logistic Regression
- **Optimization**: Optuna (Bayesian optimization)
- **Cross-validation**: Stratified K-Fold (k=3)

### Features
- **Original Features**: Age, frailty score, cognitive assessment, mobility, fracture type, etc.
- **Engineered Features**: 
  - Lagged features (1, 2, 3 periods)
  - Moving averages (3-period window)
  - Temporal patterns

### Performance Metrics
The model is evaluated using:
- Accuracy
- F1-Score (macro)
- Precision & Recall (macro)
- Log Loss
- ROC-AUC (multi-class)
- Confusion Matrix
- Precision-Recall Curves

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Features**:
  - Single patient prediction
  - Batch CSV upload
  - Model performance metrics display
  - Interactive UI components

### Backend
- **Framework**: FastAPI
- **ML Libraries**: 
  - XGBoost
  - scikit-learn
  - Optuna
  - pandas, numpy
- **Features**:
  - RESTful API endpoints
  - Automatic feature engineering
  - Model serving with pickle
  - Interactive API documentation (Swagger/ReDoc)

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- pip and npm

### 1. Train the Model

```bash
# Install Python dependencies
pip install -r requirements.txt

# Train the model (creates best_stacking_model.pkl and model_metrics.pkl)
python model.py
```

### 2. Start Backend

```bash
# Run FastAPI server
python api.py
```

Backend will be available at `http://localhost:8000`

### 3. Start Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Single Prediction
```bash
POST /predict
Content-Type: application/json

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

### Batch Prediction
```bash
POST /predict_batch
Content-Type: application/json

[
  { ...patient1_data... },
  { ...patient2_data... }
]
```

### Model Information
```bash
GET /model_info
```

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build Docker image
docker build -t ml-web-app .

# Run container
docker run -p 8000:8000 ml-web-app
```

## ☁️ Cloud Deployment (Render/DigitalOcean)

### Option 1: Render (Recommended)

1. **Connect Repository**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**
   - Name: `ml-web-app-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python api.py`
   - Add environment variable: `PORT=8000`

3. **Configure Frontend Service**
   - Name: `ml-web-app-frontend`
   - Environment: `Node`
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npm run preview`
   - Add environment variable: `VITE_API_BASE_URL=<backend-url>`

### Option 2: DigitalOcean App Platform

Use the provided `app.yaml` configuration:

```bash
# Deploy using doctl CLI
doctl apps create --spec app.yaml
```

Or deploy via UI by uploading `app.yaml`

## 🧪 Testing

### Test Backend API
```bash
python test_api.py
```

### Test with cURL
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

## 📁 Project Structure

```
ml_web_app/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── lib/            # API client & utilities
│   │   └── App.jsx         # Main app component
│   └── package.json
├── api.py                   # FastAPI backend
├── model.py                 # Model training script
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
├── app.yaml                # DigitalOcean App Spec
├── render.yaml             # Render configuration
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
PORT=8000
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:8000
```

**Production Frontend (.env.production)**
```
VITE_API_BASE_URL=https://your-backend-url.com
```

## 📊 Model Training Details

The model training process includes:

1. **Data Preprocessing**
   - Feature selection (16 core features)
   - Temporal feature engineering (lags, moving averages)
   - Missing value imputation

2. **Hyperparameter Optimization**
   - Framework: Optuna
   - Trials: 5 (configurable)
   - Optimization metric: Negative log loss
   - Search space: n_estimators for base models

3. **Model Evaluation**
   - Generates comprehensive visualizations
   - Saves metrics to `model_metrics.pkl`
   - Creates evaluation plots in `evaluation_metrics/`


## 🙏 Acknowledgments

- UNSW Health Datathon 2025
- Dataset providers

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check API documentation at `/docs`
- Review deployment guides in project root




