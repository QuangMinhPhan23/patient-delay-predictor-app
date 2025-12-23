# DigitalOcean Deployment Guide

This application is now configured for deployment on DigitalOcean App Platform.

## Prerequisites

1. DigitalOcean account
2. GitHub repository connected to DigitalOcean
3. Model files (`best_stacking_model.pkl`, `model_metrics.pkl`) in the repository OR ensure model training runs during deployment

## Deployment Options

### Option 1: Using App Platform UI (Recommended)

1. **Log in to DigitalOcean**
   - Go to https://cloud.digitalocean.com/apps

2. **Create New App**
   - Click "Create" → "Apps"
   - Choose "GitHub" as the source
   - Select your repository: `QuangMinhPhan23/ml_web_app`
   - Select branch: `main`

3. **Configure Backend Service**
   - Name: `backend`
   - Source Directory: `/`
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `python test.py`
   - HTTP Port: `8000`
   - Environment: Python
   - Add environment variable:
     - `PORT`: `8000`

4. **Configure Frontend Service**
   - Name: `frontend`
   - Source Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Run Command: `npm run preview`
   - HTTP Port: `3000`
   - Environment: Node.js
   - Add environment variable (BUILD TIME):
     - `VITE_API_BASE_URL`: `${backend.PUBLIC_URL}`

5. **Deploy**
   - Click "Next" → Review → "Create Resources"
   - Wait for deployment to complete (5-10 minutes)

### Option 2: Using App Spec (app.yaml)

1. **Log in to DigitalOcean**
2. **Create New App**
3. **Choose App Spec**
   - Upload or paste the contents of `app.yaml`
4. **Deploy**

### Option 3: Using Docker (Backend Only)

1. **Build and push Docker image:**
   ```bash
   docker build -t ml-web-app-backend .
   docker tag ml-web-app-backend registry.digitalocean.com/your-registry/ml-web-app-backend
   docker push registry.digitalocean.com/your-registry/ml-web-app-backend
   ```

2. **Deploy on App Platform:**
   - Create new app
   - Choose "DigitalOcean Container Registry"
   - Select your image

## Post-Deployment Steps

1. **Get Backend URL**
   - After deployment, copy the backend public URL
   - Example: `https://ml-web-app-backend-xxxxx.ondigitalocean.app`

2. **Update Frontend Environment Variable**
   - Go to frontend service settings
   - Update `VITE_API_BASE_URL` with the actual backend URL
   - Redeploy frontend

3. **Update CORS (if needed)**
   - If using a custom domain, update the `allow_origins` list in `test.py`

## Environment Variables

### Backend
- `PORT`: Port for the backend server (default: 8000)

### Frontend
- `VITE_API_BASE_URL`: URL of the backend API (set to backend service URL)

## Monitoring

- Check logs in DigitalOcean App Platform console
- Health check endpoint: `/health`
- Root endpoint: `/`

## Troubleshooting

### Model Not Loading
- Ensure `best_stacking_model.pkl` is in the repository, OR
- Ensure `model.py` runs successfully during build

### CORS Errors
- Verify frontend URL is in the `allow_origins` list in `test.py`
- Update and redeploy if necessary

### Build Failures
- Check build logs in DigitalOcean console
- Verify `requirements.txt` includes all dependencies
- Verify `package.json` in frontend directory is correct

## Costs

- Basic tier (basic-xxs): ~$5/month per service
- Total estimated cost: ~$10/month (backend + frontend)

## Updates

Push to the `main` branch to trigger automatic redeployment.

## Custom Domain (Optional)

1. Go to your app settings
2. Add custom domain
3. Update DNS records as instructed
4. Update CORS settings if needed
