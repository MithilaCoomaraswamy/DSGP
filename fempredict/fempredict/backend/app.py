from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from datetime import datetime, timedelta
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import openai
import jwt
from functools import wraps
import os


SECRET_KEY = os.getenv('SECRET_KEY', 'your-default-secret-key')

RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook"

OPENAI_API_KEY = 'your-openai-api-key'  # Replace with your OpenAI API key

# OpenAI ChatGPT API URL
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

exercise_model = joblib.load("model/Random_forest_model.pkl")
exercise_data = pd.read_csv("dataset/Encoded_Exercise_Dataset.csv")
period_model = joblib.load("model/menses_predictor.pkl")
ovulation_model = joblib.load("model/ovulation_predictor.pkl")

app = Flask(__name__)
CORS(app)

# SQLite database path
DB_PATH = 'database/db.sqlite'


# Utility function to get the database connection
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing!"}), 403
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['email']
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403

        return f(current_user, *args, **kwargs)
    return decorator

# Create user table if it doesn't exist
def create_user_table():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE,
                    password TEXT NOT NULL
                )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS cycles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    start_date TEXT NOT NULL,
                    cycle_length INTEGER NOT NULL,
                    menses_length INTEGER NOT NULL,
                    cycle_number INTEGER NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.commit()
    conn.close()


# API to handle user signup
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')

    if not email or not password or not confirm_password:
        return jsonify({"message": "Missing required fields."}), 400

    if password != confirm_password:
        return jsonify({"message": "Passwords do not match."}), 400

    # Hash the password before saving to the database
    hashed_password = generate_password_hash(password)

    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"message": "User created successfully."}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "User already exists."}), 400


# API to handle user login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Missing required fields."}), 400

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if user is None:
        return jsonify({"message": "User not found."}), 404

    # Check if password is correct
    if not check_password_hash(user['password'], password):
        return jsonify({"message": "Incorrect password."}), 400

    # Create a JWT token and return it
    token = jwt.encode({
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
        }, SECRET_KEY, algorithm='HS256')

    return jsonify({"message": "Login successful.", "token": token}), 200


# API to get user profile including cycle details (GET)
@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    conn = get_db_connection()
    
    # Retrieve user info
    user = conn.execute('SELECT * FROM users WHERE email = ?', (current_user,)).fetchone()
    
    if user:
        # Retrieve the cycle information for the user
        cycles = conn.execute('SELECT * FROM cycles WHERE user_id = ?', (user['id'],)).fetchall()
        
        # Format cycle data
        cycle_data = []
        for cycle in cycles:
            cycle_data.append({
                "start_date": cycle['start_date'],
                "cycle_length": cycle['cycle_length'],
                "menses_length": cycle['menses_length'],
                "cycle_number": cycle['cycle_number']
            })

        conn.close()
        return jsonify({
            "email": user['email'],
            "cycles": cycle_data
        }), 200
    return jsonify({"message": "User not found."}), 404


# API to update user profile (PUT)
@app.route('/api/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()

    new_email = data.get('email')
    new_password = data.get('password')

    if not new_email or not new_password:
        return jsonify({"message": "Email and password are required."}), 400

    hashed_password = generate_password_hash(new_password)

    conn = get_db_connection()
    
    # Update user information
    conn.execute('UPDATE users SET email = ?, password = ? WHERE email = ?',
                 (new_email, hashed_password, current_user))
    conn.commit()

    # If the user wants to update their cycle information, handle that as well
    cycle_data = data.get('cycles', [])
    for cycle in cycle_data:
        start_date = cycle.get('start_date')
        cycle_length = cycle.get('cycle_length')
        menses_length = cycle.get('menses_length')
        cycle_number = cycle.get('cycle_number')

        # Check if the cycle data is valid
        if start_date and cycle_length and menses_length and cycle_number:
            conn.execute('INSERT INTO cycles (user_id, start_date, cycle_length, menses_length, cycle_number) '
                         'VALUES ((SELECT id FROM users WHERE email = ?), ?, ?, ?, ?)',
                         (current_user, start_date, cycle_length, menses_length, cycle_number))
            conn.commit()

    conn.close()
    return jsonify({"message": "Profile updated successfully."}), 200



# API to delete user account (DELETE)
@app.route('/api/profile', methods=['DELETE'])
@token_required
def delete_account(current_user):
    conn = get_db_connection()
    conn.execute('DELETE FROM users WHERE email = ?', (current_user,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Account deleted successfully."}), 200


# API to handle logout (invalidate token on client-side)
@app.route('/api/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully."}), 200


@app.route('/recommend', methods=['POST'])
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
        predicted_class = exercise_model.predict(input_features)[0]

        # Use the preloaded exercise_data without reloading
        exercise_data_filtered = exercise_data.loc[exercise_data['BMIcase_encoded'] == predicted_class]
        if not exercise_data_filtered.empty:
            bmi_case = exercise_data_filtered['BMIcase'].iloc[0]
            if preference == "gym":
                exercise = exercise_data_filtered['Gym Exercise'].iloc[0]
            else:
                exercise = exercise_data_filtered['Home Exercise'].iloc[0]
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

# API to get user cycles
@app.route('/api/cycles', methods=['GET'])
@token_required
def get_cycles(current_user):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (current_user,)).fetchone()

    if user:
        # Retrieve all cycles for the user
        cycles = conn.execute('SELECT * FROM cycles WHERE user_id = ?', (user['id'],)).fetchall()
        
        cycle_data = []
        for cycle in cycles:
            cycle_data.append({
                "start_date": cycle['start_date'],
                "cycle_length": cycle['cycle_length'],
                "menses_length": cycle['menses_length'],
                "cycle_number": cycle['cycle_number']
            })

        conn.close()
        return jsonify({"cycles": cycle_data}), 200
    return jsonify({"message": "User not found."}), 404

# API to update a cycle
@app.route('/api/cycles', methods=['PUT'])
@token_required
def update_cycles(current_user):
    data = request.get_json()

    cycle_id = data.get('cycle_id')
    start_date = data.get('start_date')
    cycle_length = data.get('cycle_length')
    menses_length = data.get('menses_length')
    cycle_number = data.get('cycle_number')

    if not all([cycle_id, start_date, cycle_length, menses_length, cycle_number]):
        return jsonify({"message": "Missing cycle data."}), 400

    conn = get_db_connection()
    conn.execute('UPDATE cycles SET start_date = ?, cycle_length = ?, menses_length = ?, cycle_number = ? WHERE id = ?',
                 (start_date, cycle_length, menses_length, cycle_number, cycle_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Cycle updated successfully."}), 200

    
@app.route('/predict-cycle', methods=['POST'])
def predict_cycle():
    try:
        # Get data from the incoming request
        data = request.get_json()

        # Check if the required fields are present
        required_fields = ["startDate", "cycleLength", "mensesLength", "averageMensesLength", "averageCycleLength", "cycleNumber"]
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Extract the relevant fields
        start_date_str = data.get("startDate")
        cycle_length = data.get("cycleLength")
        menses_length = data.get("mensesLength")
        average_menses_length = data.get("averageMensesLength")
        average_cycle_length = data.get("averageCycleLength")
        cycle_number = data.get("cycleNumber")
        
        # Ensure that the fields are valid integers
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")  # Assuming startDate is in "YYYY-MM-DD" format
            cycle_length = int(cycle_length)
            menses_length = int(menses_length)
            average_menses_length = int(average_menses_length)
            average_cycle_length = int(average_cycle_length)
            cycle_number = int(cycle_number)
        except (ValueError, TypeError) as e:
            return jsonify({
                "error": f"Invalid data provided: {str(e)}"
            }), 400

        input_data_menses = pd.DataFrame([{
            'CycleNumber': cycle_number, 
            'MeanCycleLength': average_cycle_length,
            'LengthofMenses': menses_length,
            'MeanMensesLength': average_menses_length
        }])
        
        input_data_ovulation = pd.DataFrame([{
            'CycleNumber': cycle_number, 
            'LengthofCycle': cycle_length,
            'MeanCycleLength': average_cycle_length,
            'LengthofMenses': menses_length,
            'MeanMensesLength': average_menses_length
        }])

        # Perform the calculation of the next menses and ovulation dates
        # Assuming these models are already loaded elsewhere in your code
        next_menses_prediction = period_model.predict(input_data_menses)
        ovulation_prediction = ovulation_model.predict(input_data_ovulation)
        
        next_menses_date = start_date + timedelta(days=next_menses_prediction[0])   
        ovulation_date = start_date + timedelta(days=ovulation_prediction[0])
        
        # Return the prediction results
        return jsonify({
            "nextMensesDate": next_menses_date.strftime("%Y-%m-%d"),
            "ovulationDate": ovulation_date.strftime("%Y-%m-%d")
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json  # Get user message from frontend
    user_message = data.get("message", "")

    # Send user message to Rasa
    rasa_response = requests.post(RASA_SERVER_URL, json={"sender": "user", "message": user_message})

    if rasa_response.status_code == 200:
        rasa_messages = rasa_response.json()  # Parse Rasa response

        # Extract bot messages from the response
        bot_responses = [msg["text"] for msg in rasa_messages if "text" in msg]

        return jsonify({"response": " ".join(bot_responses)})  # Return response to frontend
    else:
        return jsonify({"response": "Sorry, I couldn't connect to the chatbot."}), 500
    
# Ping route - Check if the API is running
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Server is running"})


if __name__ == '__main__':
    create_user_table()
    app.run(debug=True)
