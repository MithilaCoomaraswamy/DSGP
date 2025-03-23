from flask import Flask, request, jsonify, render_template
import pandas as pd
import joblib
import os

app = Flask(__name__)

# Load the model
model_path = os.path.join("C:/Users/User/OneDrive/IIT/PCOS_Backend/saved_models", "random_forest_pcos_model.pkl")
model = joblib.load(model_path)

# Expected feature list in training order
FEATURES = [
    'Age', 'Sexual_Activity', 'Sleep_Hours', 'Stress_Level',
    'Alcohol_Caffeine_Consumption', 'Smoking', 'Age_Menarche',
    'Menstrual_Cycle_Regularity', 'Period_Duration', 'Excess_Hair_Growth',
    'Acne', 'Weight_Gain', 'Hair_Thinning', 'Family_History_PCOS',
    'Height_cm', 'Weight_kg', 'BMI', 'Ethnicity_Asian',
    'Ethnicity_Caucasian', 'Ethnicity_Hispanic', 'Ethnicity_Other',
    'Geography_Urban', 'Diet_Moderate', 'Diet_Unhealthy'
]

# Home route to serve the form
@app.route('/')
def home():
    return render_template('index.html')  # index.html should be in /templates

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("🔍 Incoming data:", data)

        # Check for missing fields
        if not all(feature in data for feature in FEATURES):
            missing = [f for f in FEATURES if f not in data]
            print("❌ Missing fields:", missing)
            return jsonify({"error": "Missing input fields", "missing": missing}), 400

        # Convert and reorder input
        input_df = pd.DataFrame([data])[FEATURES]
        print("✅ Ordered DataFrame:\n", input_df)

        # Prediction
        prediction = model.predict(input_df)[0]

        # Construct response
        if prediction == 1:
            result = {
                "prediction": "High Risk",
                "message": "You may be at high risk of Polycystic Ovary Syndrome (PCOS).",
                "recommendation": "Please consult a gynecologist or endocrinologist for proper diagnosis and early intervention."
            }
        else:
            result = {
                "prediction": "Low Risk",
                "message": "You are currently at low risk of Polycystic Ovary Syndrome (PCOS).",
                "recommendation": "Maintain your healthy lifestyle and monitor any changes in your health over time."
            }

        return jsonify(result)

    except Exception as e:
        print("🔥 Server Error:", str(e))
        return jsonify({"error": "Something went wrong on the server.", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
