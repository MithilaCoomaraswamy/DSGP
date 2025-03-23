
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

model = joblib.load("Model/Random_forest_model .pkl")
data = pd.read_csv("Dataset/Encoded_Exercise_Dataset.csv")

app = Flask(__name__)
CORS(app)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        print(f"Received request: {request.json}")  # Log request data

        if not request.json:
            return jsonify({"error": "Empty request body"}), 400

        weight = request.json.get("weight")
        height = request.json.get("height")
        age = request.json.get("age")
        preference = request.json.get("preference", "").lower()

        # Validate inputs
        if weight is None or height is None or age is None:
            return jsonify({"error": "Missing required fields: weight, height, age"}), 400

        try:
            weight = float(weight)
            height = float(height)
            age = int(age)
        except ValueError:
            return jsonify({"error": "Weight and height must be numbers, age must be an integer"}), 400

        if not (1 <= weight <= 600):
            return jsonify({"error": "Weight must be between 1 and 600 kg"}), 400
        if not (0.1 <= height <= 2.5):
            return jsonify({"error": "Height must be between 0.1 and 2.5 meters"}), 400
        if not (1 <= age <= 100):
            return jsonify({"error": "Age must be between 1 and 100 years"}), 400

        if preference not in ["gym", "home"]:
            return jsonify({"error": "Invalid preference. Choose 'gym' or 'home'."}), 400

        # Calculate BMI
        bmi = weight / (height ** 2)

        # Prepare input for model
        input_features = pd.DataFrame([[weight, height, bmi, age]], columns=["Weight", "Height", "BMI", "Age"])

        # Predict BMI case
        predicted_class = model.predict(input_features)[0]

        # Get exercise recommendations
        exercise_data = data.loc[data['BMIcase_encoded'] == predicted_class]
        if not exercise_data.empty:
            bmi_case = exercise_data['BMIcase'].iloc[0]
            exercise = exercise_data['Gym Exercise'].iloc[0] if preference == "gym" else \
            exercise_data['Home Exercise'].iloc[0]
        else:
            bmi_case = "Unknown"
            exercise = "General workout" if preference == "gym" else "Body weight exercises"

        return jsonify({
            "bmi": round(bmi, 2),
            "bmi_case": bmi_case,
            "exercise": exercise
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

