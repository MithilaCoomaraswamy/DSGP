import os
import logging
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import joblib
import pandas as pd
from datetime import datetime, timedelta
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import openai
from functools import wraps
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook"

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')  # Use environment variable for OpenAI API Key

# OpenAI ChatGPT API URL
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

exercise_model = joblib.load("model/Random_forest_model.pkl")
exercise_data = pd.read_csv("dataset/Encoded_Exercise_Dataset.csv")
period_model = joblib.load("model/menses_predictor.pkl")
ovulation_model = joblib.load("model/ovulation_predictor.pkl")
model = joblib.load("model/random_forest_pcos_model.pkl")

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'your-secret-key')  # Secure Flask secret key
app.config['SESSION_COOKIE_NAME'] = 'session'  # Cookie name
app.config['SESSION_PERMANENT'] = True  # Ensure session is permanent
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)
serializer = URLSafeTimedSerializer(app.secret_key)
CORS(app)

# SQLite database file
DATABASE = os.getenv('DATABASE', 'database/fempredict.db')  # Use environment variable for the database path

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Create tables if they don't exist
def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(''' 
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    ''')

    cursor.execute(''' 
    CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        verification_code TEXT NOT NULL,
        verification_code_expiry TEXT NOT NULL
    )
    ''')

    cursor.execute(''' 
    CREATE TABLE IF NOT EXISTS cycles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        cycle INTEGER NOT NULL,
        period_start TEXT NOT NULL,
        period_length INTEGER NOT NULL,
        cycle_length INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    conn.commit()
    conn.close()

def delete_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(''' 
    DROP TABLE IF EXISTS cycles
    ''')

    conn.commit()
    conn.close()

# Call the function to create tables when the app starts
create_tables()

# User authentication
def check_credentials(email, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    if user and check_password_hash(user['password'], password):
        return user
    return None

def check_user_exists(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    return user

def send_verification_email(email, token):
    sender_email = os.getenv("SENDER_EMAIL", "fempredict@gmail.com")  # Use environment variable for the email
    sender_password = os.getenv("SENDER_PASSWORD", "jptm vipw jimb vhkv")  # Use environment variable for password
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    # Create the email message
    verification_link = url_for('verify_email', token=token, _external=True)
    body = f'Click the following link to verify your email and log in: {verification_link}'

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    message["Subject"] = "Email Verification"

    message.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.route('/send-verification', methods=['POST'])
def send_verification():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = check_user_exists(email)
    if not user:
        return jsonify({"message": "Email not found in database"}), 404

    # Generate a unique token
    token = serializer.dumps(email, salt='email-confirm')

    # Send email with verification link
    if send_verification_email(email, token):
        return jsonify({"message": "Verification email sent"}), 200
    else:
        return jsonify({"message": "Error sending verification email"}), 500

@app.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    try:
        # Confirm the token and extract the email
        email = serializer.loads(token, salt='email-confirm', max_age=3600)  # Token expires in 1 hour
    except SignatureExpired:
        return jsonify({'message': 'The verification link has expired.'}), 400
    except Exception:
        return jsonify({'message': 'Invalid or malformed token.'}), 400

    # Check if the user exists in the database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({'message': 'User not found.'}), 404

    # Log the user in by setting session data
    session['user'] = email  # Store the user email in the session
    print(f"User {email} logged in successfully.")  # Add logging here
    return jsonify({'message': 'Email verified successfully! You are now logged in.'}), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)  # Remove the user from the session
    return jsonify({'message': 'Logged out successfully'}), 200

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = check_credentials(email, password)
    if user:
        session['user'] = email  # Set the session if user is valid
        return jsonify({
            "message": "Login successful",
            "user": {
                "email": user['email'],
                "created_at": user['created_at']
            }
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not password:
        return jsonify({"message": "Password is required"}), 400

    hashed_password = generate_password_hash(password, method='scrypt')
    created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        conn.close()
        return jsonify({"message": "User with this email already exists."}), 400

    cursor.execute("INSERT INTO users (email, password, created_at) VALUES (?, ?, ?)",
                   (email, hashed_password, created_at))
    conn.commit()

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    new_user = cursor.fetchone()
    conn.close()

    return jsonify({
        "message": "User registered successfully.",
        "user": {
            "email": new_user['email'],
            "created_at": new_user['created_at']
        }
    }), 201


@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
    email = session.get('user')
    
    if not email:
        return jsonify({"message": "User not logged in"}), 401

    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return jsonify({"message": "Old and new passwords are required"}), 400

    # Check if the old password is correct
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user or not check_password_hash(user['password'], old_password):
        conn.close()
        return jsonify({"message": "Old password is incorrect"}), 400

    # Update password
    hashed_password = generate_password_hash(new_password, method='scrypt')
    cursor.execute("UPDATE users SET password = ? WHERE email = ?", (hashed_password, email))
    conn.commit()
    conn.close()

    return jsonify({"message": "Password updated successfully"}), 200

@app.route('/change-email', methods=['POST'])
def change_email():
    data = request.get_json()
    email = session.get('user')
    
    if not email:
        return jsonify({"message": "User not logged in"}), 401

    new_email = data.get('new_email')
    password = data.get('password')

    if not new_email or not password:
        return jsonify({"message": "New email and password are required"}), 400

    # Verify password
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user or not check_password_hash(user['password'], password):
        conn.close()
        return jsonify({"message": "Invalid credentials"}), 400

    # Check if the new email already exists
    cursor.execute("SELECT * FROM users WHERE email = ?", (new_email,))
    existing_user = cursor.fetchone()
    if existing_user:
        conn.close()
        return jsonify({"message": "New email already in use"}), 400

    # Update email
    cursor.execute("UPDATE users SET email = ? WHERE email = ?", (new_email, email))
    conn.commit()
    conn.close()

    session['user'] = new_email  # Update session with new email
    return jsonify({"message": "Email updated successfully"}), 200

@app.route('/delete-account', methods=['DELETE'])
def delete_account():
    data = request.get_json()
    email = session.get('user')

    if not email:
        return jsonify({"message": "User not logged in"}), 401

    password = data.get('password')

    if not password:
        return jsonify({"message": "Password is required"}), 400

    # Verify password
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user or not check_password_hash(user['password'], password):
        conn.close()
        return jsonify({"message": "Invalid credentials"}), 400

    # Delete user account
    cursor.execute("DELETE FROM users WHERE email = ?", (email,))
    cursor.execute("DELETE FROM cycles WHERE email = ?", (email,))  # Delete any associated cycle data
    conn.commit()
    conn.close()

    session.pop('user', None)  # Remove user from session
    return jsonify({"message": "Account deleted successfully"}), 200

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        print(f"Received request: {request.data}")  # Log raw request
        print(f"Request JSON: {request.json}")  # Log JSON request

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
    
def get_cycle_number_from_db(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Fetch the highest cycle number from the 'cycles' table
    cursor.execute("SELECT MAX(cycle) FROM cycles WHERE email = ?", (email,))
    result = cursor.fetchone()
    
    # If there's no cycle in the database, start from cycle 1
    cycle_number = result[0] + 1 if result[0] is not None else 1
    conn.close()
    
    return cycle_number

    
@app.route('/save_cycle_data', methods=['POST'])
def save_cycle_data():
    data = request.json
    print("Received data:", data)  # Log the incoming data for debugging

    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    LengthofMenses = data['mensesLength']  # Updated field name
    LengthofCycle = data['cycleLength']    # Updated field name
    start_date_str = data['startDate']

    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')

    # Fetch cycle number from the database based on email
    cycle_number = get_cycle_number_from_db(email)

    # Validate input data
    if not email or not start_date or not LengthofCycle or not LengthofMenses:
        print("Missing data!")
        return jsonify({"error": "Missing data"}), 400

    try:
        # Connect to SQLite database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(''' 
            INSERT INTO cycles (email, cycle, period_start, period_length, cycle_length)
            VALUES (?, ?, ?, ?, ?)
        ''', (email, cycle_number, start_date, LengthofMenses, LengthofCycle))

        conn.commit()
        conn.close()

        return jsonify({"message": "Cycle data saved successfully."}), 201

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_cycle_data', methods=['GET'])
def get_cycle_data():
    email = request.args.get('email')  # Get email from query params
    if not email:
        return jsonify({'error': 'Email is required'}), 400  # If no email is provided, return error

    try:
        # Fetch cycle data from the database
        conn = sqlite3.connect('database/fempredict.db')
        conn.row_factory = sqlite3.Row  # Enable dictionary-like access to rows
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM cycles WHERE email = ?", (email,))
        cycle_history = cursor.fetchall()

        if not cycle_history:
            return jsonify({"message": "No cycle data found for this user."}), 404

        # Function to ensure date formatting (ISO 8601)
        def format_date(date_string):
            try:
                # Assuming the date in the database is in 'YYYY-MM-DD' format
                date = datetime.strptime(date_string, '%Y-%m-%d')
                return date.strftime('%Y-%m-%d')  # Convert to ISO format (YYYY-MM-DD)
            except ValueError:
                return date_string  # Return as is if the format is invalid
        
        cycle_data = [
            {
                "cycle": cycle["cycle"],
                "period_start": format_date(cycle["period_start"]),  # Format the period start date
                "period_length": cycle["period_length"],
                "cycle_length": cycle["cycle_length"]
            }
            for cycle in cycle_history
        ]

        print("Formatted cycle data:", cycle_data)
        conn.close()

        return jsonify({
            "message": "Cycle data fetched successfully.",
            "cycleHistory": cycle_data
        })

    except Exception as e:
        print(f"Error fetching cycle data: {e}")
        return jsonify({"error": str(e)}), 500


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

FEATURES = [
    'Age', 'Sexual_Activity', 'Sleep_Hours', 'Stress_Level',
    'Alcohol_Caffeine_Consumption', 'Smoking', 'Age_Menarche',
    'Menstrual_Cycle_Regularity', 'Period_Duration', 'Excess_Hair_Growth',
    'Acne', 'Weight_Gain', 'Hair_Thinning', 'Family_History_PCOS',
    'Height_cm', 'Weight_kg', 'BMI', 'Ethnicity_Asian',
    'Ethnicity_Caucasian', 'Ethnicity_Hispanic', 'Ethnicity_Other',
    'Geography_Urban', 'Diet_Moderate', 'Diet_Unhealthy'
]

logging.basicConfig(level=logging.INFO)

@app.route('/calculate', methods=['POST'])
def calculate_risk():
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
     