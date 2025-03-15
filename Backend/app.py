
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
        print(f"Received request: {request.data}")  # Log raw request
        print(f"Request JSON: {request.json}")  # Log JSON request

        if not request.json:
            return jsonify({"error": "Empty request body"}), 400

        weight = float(request.json.get("weight", 0))
        height = float(request.json.get("height", 0))
        age = int(request.json.get("age", 0))
        preference = request.json.get("preference", "").lower()

        if weight <= 0 or height <= 0 or age <= 0:
            return jsonify({"error": "Invalid input values"}), 400

        if preference not in ["gym", "home"]:
            return jsonify({"error": "Invalid preference. Choose 'gym' or 'home'."}), 400


        bmi = weight / (height ** 2)

        # Preparing the input data
        input_features = pd.DataFrame([[weight, height, bmi, age]], columns=["Weight", "Height", "BMI", "Age"])

        # Predicting bmi cases from the model
        predicted_class = model.predict(input_features)[0]

        # Get exercise recommendations based on the predicted bmi case
        exercise_data = data.loc[data['BMIcase_encoded'] == predicted_class]
        if not exercise_data.empty:
            bmi_case = exercise_data['BMIcase'].iloc[0]
            if preference == "gym":
                exercise = exercise_data['Gym Exercise'].iloc[0]
            else:
                exercise = exercise_data['Home Exercise'].iloc[0]
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

