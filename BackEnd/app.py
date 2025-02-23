from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask("PCOS_Backend")

# Load the trained model
model = joblib.load("saved_models/best_traditional_model.pkl")

# Default values for all 24 features
DEFAULT_FEATURES = [25, 60, 1.65, 22.0, 1, 0, 0, 12.5, 1.2, 3.0, 4.5, 2.1, 30.0, 80, 120, 5, 5, 1.0, 5.0, 1, 0, 2, 1, 1]

@app.route('/')
def home():
    return "PCOS Risk Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()  # Get user input
        user_input = data.get("features", {})  # Get features (if provided)
        
        # Fill missing values with defaults
        features = DEFAULT_FEATURES.copy()
        for i, value in user_input.items():
            features[int(i)] = value  # Update provided values
            
        # Ensure correct shape
        features = np.array(features).reshape(1, -1)  
        prediction = model.predict(features)  
        confidence = model.predict_proba(features)  

        response = {
            "risk_level": int(prediction[0]),
            "confidence": confidence.tolist()
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
