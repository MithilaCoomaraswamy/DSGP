from flask import Flask, request, render_template, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__, template_folder="templates", static_folder="static")

# Model Path
MODEL_PATH = os.path.join("saved_models", "best_traditional_model.pkl")

# Load Model
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        if not hasattr(model, "predict"):
            raise ValueError("Loaded model does not have a 'predict' method!")
        print("✅ Model loaded successfully.")
        print(f"✅ Model expects {model.n_features_in_} features.")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
else:
    print(f"❌ Model file not found at: {MODEL_PATH}")


# 🌐 Web form route (optional - you can remove if only using Postman)
@app.route("/", methods=["GET", "POST"])
def home():
    values = {}
    prediction = None
    error = None

    if request.method == "POST":
        try:
            age = float(request.form["age"])
            weight = float(request.form["weight"])
            height = float(request.form["height"]) / 100
            insulin = float(request.form["insulin"])
            cycle = int(request.form["cycle"])
            hair_growth = int(request.form["hair_growth"])
            skin_darkening = int(request.form["skin_darkening"])

            bmi = weight / (height ** 2)

            features = prepare_features(age, weight, height, bmi, insulin, cycle, hair_growth, skin_darkening)

            if model is None:
                error = "Prediction unavailable - Model is not loaded!"
            else:
                prediction = make_prediction(features)

        except Exception as e:
            error = str(e)

    return render_template("index.html", values=values, prediction=prediction, error=error)


# 📬 Postman API route (main focus now)
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model is not loaded"}), 500

    try:
        data = request.get_json()
        print(f"📥 Received Data: {data}")

        age = float(data.get("age"))
        weight = float(data.get("weight"))
        height = float(data.get("height"))
        insulin = float(data.get("insulin"))
        cycle = int(data.get("cycle"))
        hair_growth = int(data.get("hair_growth"))
        skin_darkening = int(data.get("skin_darkening"))

        bmi = weight / (height ** 2)

        features = prepare_features(age, weight, height, bmi, insulin, cycle, hair_growth, skin_darkening)
        print(f"📊 Final Features Array (24 features): {features}")

        prediction = make_prediction(features)

        return jsonify({"prediction": prediction})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# 🔧 Helper - Prepares full 24 features
def prepare_features(age, weight, height, bmi, insulin, cycle, hair_growth, skin_darkening):
    # Assume these 8 are the real inputs. The other 16 can be 0 or sensible defaults.
    # Example: hormones, medical history, etc., you don't have right now.

    features = [
        age, weight, height, bmi, insulin, cycle, hair_growth, skin_darkening,  # your 8 features
        0, 0, 0, 0, 0, 0, 0, 0,               # Placeholder for missing hormone levels, history etc.
        0, 0, 0, 0, 0, 0, 0, 0                # Add 16 zeros to match expected 24 features
    ]
    return np.array([features])


# 🔧 Helper - Makes prediction safely
def make_prediction(features):
    if features.shape[1] != model.n_features_in_:
        raise ValueError(f"Model expects {model.n_features_in_} features, but got {features.shape[1]}")

    raw_prediction = model.predict(features)[0]
    print(f"🔮 Raw Model Prediction: {raw_prediction}")

    return "High Risk" if raw_prediction == 1 else "Low Risk"


# 🚀 Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
