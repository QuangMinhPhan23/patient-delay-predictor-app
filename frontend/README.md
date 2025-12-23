# ML Model Dashboard - Frontend

A modern React frontend for the Stacking Classifier Model API built with Vite, shadcn/ui, and Lucide icons.

## Features

- 🎯 **Single Prediction Dashboard** - Input individual patient data and get instant predictions
- 👥 **Batch Prediction Dashboard** - Upload or paste JSON for multiple predictions
- 📊 **Model Info Dashboard** - View model architecture, metrics, and performance details
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🔄 **Real-time API Status** - Monitor backend connectivity
- 📱 **Responsive Design** - Works seamlessly on all devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- FastAPI backend running on http://localhost:8000

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to http://localhost:3000

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SinglePrediction.jsx    # Single prediction form
│   │   ├── BatchPrediction.jsx     # Batch prediction interface
│   │   ├── ModelInfo.jsx           # Model metrics display
│   │   ├── Card.jsx                # Card components
│   │   ├── Button.jsx              # Button component
│   │   ├── Input.jsx               # Input component
│   │   └── Tabs.jsx                # Tabs component
│   ├── lib/
│   │   ├── api.js                  # API client functions
│   │   └── utils.js                # Utility functions
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Dashboards

### 1. Single Prediction Dashboard
- Input form for all 16 patient features
- Real-time validation
- Visual display of prediction results
- Probability distribution charts

### 2. Batch Prediction Dashboard
- JSON file upload support
- Manual JSON input
- Sample data loader
- Downloadable results
- Bulk prediction processing

### 3. Model Info Dashboard
- Model architecture details
- Performance metrics (Accuracy, F1, Precision, Recall, etc.)
- Best hyperparameters
- Visual metric representations

## API Integration

The frontend connects to the FastAPI backend at `http://localhost:8000`. Make sure your backend is running before starting the frontend.

Endpoints used:
- `GET /health` - API health check
- `POST /predict` - Single prediction
- `POST /predict_batch` - Batch predictions
- `GET /model_info` - Model information

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Recharts** - Data visualization

## Customization

### Colors
Edit the color scheme in `tailwind.config.js` and `src/index.css`.

### API Base URL
Change the API endpoint in `src/lib/api.js`:
```javascript
const API_BASE_URL = 'http://your-api-url:8000';
```

## Troubleshooting

**API Connection Issues:**
- Ensure the FastAPI backend is running on port 8000
- Check CORS settings on the backend
- Verify network connectivity

**Build Issues:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## License

MIT
