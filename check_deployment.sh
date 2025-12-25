#!/bin/bash
# This script helps verify your deployment is ready

echo "🔍 Checking deployment prerequisites..."
echo ""

# Check if model files exist
if [ -f "best_stacking_model.pkl" ]; then
    echo "✅ Model file found: best_stacking_model.pkl"
else
    echo "❌ Missing: best_stacking_model.pkl"
    echo "   Run model.py to generate the model file"
fi

if [ -f "model_metrics.pkl" ]; then
    echo "✅ Metrics file found: model_metrics.pkl"
else
    echo "❌ Missing: model_metrics.pkl"
    echo "   Run model.py to generate the metrics file"
fi

# Check if evaluation_metrics folder exists
if [ -d "evaluation_metrics" ]; then
    echo "✅ Evaluation metrics folder found"
    img_count=$(ls -1 evaluation_metrics/*.png 2>/dev/null | wc -l)
    echo "   Found $img_count images"
else
    echo "❌ Missing: evaluation_metrics folder"
    echo "   Run model.py to generate evaluation metrics"
fi

# Check if render.yaml exists
if [ -f "render.yaml" ]; then
    echo "✅ Render configuration found: render.yaml"
else
    echo "❌ Missing: render.yaml"
fi

# Check if requirements.txt has correct versions
if [ -f "requirements.txt" ]; then
    echo "✅ Requirements file found"
    if grep -q "scikit-learn==1.5.2" requirements.txt; then
        echo "   ✅ scikit-learn version is pinned correctly"
    else
        echo "   ⚠️  Warning: scikit-learn should be pinned to 1.5.2"
    fi
else
    echo "❌ Missing: requirements.txt"
fi

# Check if frontend is ready
if [ -d "frontend" ]; then
    echo "✅ Frontend folder found"
    if [ -f "frontend/package.json" ]; then
        echo "   ✅ package.json found"
    else
        echo "   ❌ Missing: frontend/package.json"
    fi
else
    echo "❌ Missing: frontend folder"
fi

echo ""
echo "📝 Next steps:"
echo "1. Commit all files: git add . && git commit -m 'Ready for Render deployment'"
echo "2. Push to GitHub: git push origin main"
echo "3. Go to https://dashboard.render.com/"
echo "4. Click 'New +' → 'Blueprint'"
echo "5. Select your repository and deploy!"
echo ""
echo "For detailed instructions, see RENDER_DEPLOYMENT.md"
