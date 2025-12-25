# Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)
- Repository pushed to GitHub

## Quick Deploy (Recommended)

### Using Blueprint (Deploy Both Frontend & Backend)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to https://dashboard.render.com/
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository: `QuangMinhPhan23/ml_web_app`
   - Render will automatically detect `render.yaml`
   - Review the services (backend and frontend)
   - Click **"Apply"**

3. **Wait for Deployment**
   - Backend will deploy first (~5-10 minutes)
   - Frontend will deploy after backend is ready (~3-5 minutes)
   - Render will automatically set the API URL for the frontend

4. **Access Your App**
   - Frontend URL: `https://ml-web-app-frontend.onrender.com`
   - Backend URL: `https://ml-web-app-backend.onrender.com`

## Manual Deploy (Alternative)

### Deploy Backend First

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ml-web-app-backend`
   - **Environment**: Python
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

5. Add Environment Variable:
   - `PYTHON_VERSION`: `3.10.0`

6. Click **"Create Web Service"**
7. Wait for deployment to complete
8. Copy the backend URL (e.g., `https://ml-web-app-backend.onrender.com`)

### Deploy Frontend

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ml-web-app-frontend`
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

5. Add Environment Variable:
   - `VITE_API_BASE_URL`: Your backend URL from step 8 above
     (e.g., `https://ml-web-app-backend.onrender.com`)

6. Click **"Create Static Site"**
7. Wait for deployment to complete

## Important Notes

### Model Files
- Ensure `best_stacking_model.pkl` is committed to your repository
- Ensure `model_metrics.pkl` is committed to your repository
- Ensure `evaluation_metrics/` folder with images is committed

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30-60 seconds (cold start)
- 750 hours/month of free hosting per service

### Backend Health Check
- Render will check `/health` endpoint every few seconds
- Make sure the backend responds to keep it alive

## Post-Deployment Updates

### Update Backend CORS
If you change the frontend URL, update CORS in backend:

1. Go to backend service on Render
2. Add environment variable:
   - `FRONTEND_URL`: Your frontend URL
3. Trigger manual redeploy

### Update Frontend API URL
If you change the backend URL:

1. Go to frontend service on Render
2. Update environment variable:
   - `VITE_API_BASE_URL`: New backend URL
3. Trigger manual redeploy

## Troubleshooting

### Backend Issues

**Model Loading Errors**
```
Solution: Ensure scikit-learn version is 1.5.2 in requirements.txt
```

**Health Check Failures**
```
Solution: Check logs, ensure server binds to 0.0.0.0 and port $PORT
```

**Module Import Errors**
```
Solution: Check all dependencies are in requirements.txt with correct versions
```

### Frontend Issues

**API Connection Errors**
```
Solution: Verify VITE_API_BASE_URL environment variable is set correctly
```

**CORS Errors**
```
Solution: Add frontend URL to backend CORS allowed origins
```

**Build Failures**
```
Solution: Check package.json scripts and ensure all dependencies are listed
```

### Common Solutions

1. **Check Logs**
   - Go to service in Render dashboard
   - Click "Logs" tab
   - Look for error messages

2. **Manual Redeploy**
   - Click "Manual Deploy" → "Clear build cache & deploy"

3. **Environment Variables**
   - Verify all required env vars are set
   - After changing env vars, trigger redeploy

## Testing Deployed App

1. Visit frontend URL: `https://ml-web-app-frontend.onrender.com`
2. Test single prediction:
   - Navigate to "Single Prediction" tab
   - Fill in patient data
   - Click "Get Prediction"
3. Test batch prediction:
   - Navigate to "Batch Prediction" tab
   - Upload JSON file or use sample data
4. View model info:
   - Navigate to "Model Info" tab
   - Check metrics and visualizations

## Monitoring

- Monitor service status in Render dashboard
- Check bandwidth and build minutes usage
- Set up notifications for deployment failures

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: Create issue in your repository
