import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Check:", response.json())
    print()

def test_single_prediction():
    """Test single prediction"""
    # Sample patient data
    patient_data = {
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
    
    response = requests.post(f"{BASE_URL}/predict", json=patient_data)
    print("Single Prediction:")
    print(json.dumps(response.json(), indent=2))
    print()

def test_batch_prediction():
    """Test batch prediction"""
    # Sample batch data
    batch_data = [
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
        },
        {
            "age": 80.0,
            "addelassess": 2.0,
            "frailty": 3.0,
            "cogassess": 2.0,
            "cogstat": 2.0,
            "walk": 3.0,
            "uresidence": 2.0,
            "ftype": 2.0,
            "side": 1.0,
            "afracture": 2.0,
            "ptype": 2.0,
            "anaesth": 2.0,
            "wbear": 2.0,
            "pulcers": 2.0,
            "malnutrition": 2.0,
            "delay": 2.0
        }
    ]
    
    response = requests.post(f"{BASE_URL}/predict_batch", json=batch_data)
    print("Batch Prediction:")
    print(json.dumps(response.json(), indent=2))
    print()

def test_model_info():
    """Test model info endpoint"""
    response = requests.get(f"{BASE_URL}/model_info")
    print("Model Info:")
    print(json.dumps(response.json(), indent=2))
    print()

if __name__ == "__main__":
    try:
        print("=" * 50)
        print("Testing FastAPI Model Server")
        print("=" * 50)
        print()
        
        test_health()
        test_single_prediction()
        test_batch_prediction()
        test_model_info()
        
        print("=" * 50)
        print("All tests completed!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to API server.")
        print("Make sure the server is running on http://localhost:8000")
        print("Run: python test.py")
    except Exception as e:
        print(f"Error: {e}")
