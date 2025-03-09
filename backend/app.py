from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timedelta
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pickle
import pandas as pd
import joblib

app = Flask(__name__)

# Configure CORS for the frontend origin (React app)
CORS(app, origins=["http://localhost:5173"])

# SQLite database file
DATABASE = 'fempredict.db'

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
    CREATE TABLE IF NOT EXISTS periods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        cycle INTEGER NOT NULL,
        period_start TEXT NOT NULL,
        period_length INTEGER NOT NULL,
        mean_menses_length INTEGER NOT NULL,
        cycle_length INTEGER NOT NULL,
        mean_cycle_length INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = check_credentials(email, password)
    if user:
        return jsonify({
            "message": "Login successful",
            "user": {
                "email": user['email'],
                "created_at": user['created_at']
            }
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

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

# Function to generate a random reset token
def generate_reset_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=20))

def send_reset_email(email, verification_code):
    sender_email = "fempredict@gmail.com"  # Replace with your Gmail email
    sender_password = "jptm vipw jimb vhkv"  # Replace with your Gmail app password
    smtp_server = "smtp.gmail.com"
    smtp_port = 587  # Gmail SMTP port

    # Create the email message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    message["Subject"] = "Password Reset Verification Code"

    body = f'You requested a password reset. Use the following 6-digit verification code to proceed with resetting your password: {verification_code}'
    message.attach(MIMEText(body, "plain"))

    try:
        # Connect to the SMTP server (Gmail's SMTP relay)
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Start TLS encryption
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())
        print(f"Verification code email sent to {email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


# Function to generate a 6-digit code
def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if user:
        # Generate a random 6-digit verification code
        verification_code = generate_verification_code()
        expiry_time = (datetime.now() + timedelta(minutes=3)).strftime('%Y-%m-%d %H:%M:%S')

        # Insert the code and expiration time into the database
        cursor.execute("INSERT INTO password_resets (email, verification_code, verification_code_expiry) VALUES (?, ?, ?)", 
                       (email, verification_code, expiry_time))
        conn.commit()
        conn.close()

        # Send email with the verification code (modify the email content)
        send_reset_email(email, verification_code)

        return jsonify({"message": "Verification code sent to email."}), 200
    else:
        return jsonify({"message": "Email not found."}), 404


@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({"message": "Email and new password are required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Ensure that the email is passed as a tuple
    cursor.execute("SELECT * FROM password_resets WHERE email = ?", (email,))
    reset_entry = cursor.fetchone()

    if reset_entry:
        hashed_password = generate_password_hash(new_password, method='scrypt')
        
        # Update the user's password
        cursor.execute("UPDATE users SET password = ? WHERE email = ?", (hashed_password, email))

        # Commit the changes
        conn.commit()

        # Remove the reset entry from the password_resets table
        cursor.execute("DELETE FROM password_resets WHERE email = ?", (email,))
        conn.commit()

        # Close the connection
        conn.close()

        return jsonify({"message": "Password has been reset successfully."}), 200
    else:
        conn.close()
        return jsonify({"message": "Invalid reset token or email."}), 400


@app.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({"message": "Email and code are required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM password_resets WHERE email = ? AND verification_code = ?", (email, code))
    reset_entry = cursor.fetchone()

    if reset_entry:
        # Check if the code is expired
        code_expiry = datetime.strptime(reset_entry['verification_code_expiry'], '%Y-%m-%d %H:%M:%S')
        if code_expiry > datetime.now():
            # Verification successful, redirect the user to the edit profile page
            return jsonify({
                "message": "Verification successful. You can now proceed to edit your profile.",
                "redirect_to": "/edit-profile"  # The frontend will handle this redirection
            }), 200
        else:
            return jsonify({"message": "Verification code has expired."}), 400
    else:
        return jsonify({"message": "Invalid email or code."}), 400


ovulation_model = joblib.load('RFR.pkl')

# Function to fetch cycle number from the SQLite table based on email
import sqlite3

def get_cycle_number_from_db(email):
    try:
        # Connect to SQLite database
        conn = sqlite3.connect('fempredict.db')
        cursor = conn.cursor()

        # Query to count the number of records for the given email
        query = "SELECT COUNT(*) FROM periods WHERE email = ?"
        cursor.execute(query, (email,))
        result = cursor.fetchone()

        conn.close()

        if result:
            return result[0] + 1  # Return the count of records (cycle number)
        else:
            return 1  # If no records found, return 1 (default cycle number)

    except Exception as e:
        print(f"Error fetching cycle number: {e}")
        return None



@app.route('/predict_ovulation', methods=['POST'])
def predict_ovulation():
    try:
        # Get data from the request
        data = request.get_json()

        # Extract relevant information from the request
        user = data['user']
        email = user.get('email')  # Extract email from the user object
        LengthofCycle = data['LengthofCycle']
        LengthofMenses = data['LengthofMenses']
        MeanMensesLength = data['MeanMensesLength']
        MeanCycleLength = data['MeanCycleLength']
        start_date_str = data['startDate']

        # Convert start date from string to datetime object
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')

        # Fetch cycle number from the database based on email
        cycle_number = get_cycle_number_from_db(email)

        # Prepare input data for prediction (in the format the model expects)
        input_data = pd.DataFrame([{
            'CycleNumber': cycle_number,  # Use the cycle number fetched from the database
            'LengthofCycle': LengthofCycle,
            'MeanCycleLength': MeanCycleLength,
            'LengthofMenses': LengthofMenses,
            'MeanMensesLength': MeanMensesLength
        }])

        # Make prediction using the loaded model
        prediction = ovulation_model.predict(input_data)

        # Calculate predicted ovulation date (based on the model's output)
        ovulation_date = start_date + timedelta(days=prediction[0])

        # Calculate the day of the cycle for ovulation
        day_of_cycle = (ovulation_date - start_date).days + 1  # +1 because the cycle starts on day 1

        # Prepare the response with both the predicted ovulation date and the cycle day
        response = {
            'predictedOvulationDate': ovulation_date.strftime('%Y-%m-%d'),
            'dayOfCycle': day_of_cycle
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
menses_model = joblib.load('lengthcalculator.pkl')    

@app.route('/predict_cycle_length', methods=['POST'])
def predict_cycle_length():
    try:
        # Get data from the request
        data = request.get_json()

        user = data['user']
        email = user.get('email')  # Extract email from the user object
        LengthofMenses = data['LengthofMenses']
        MeanMensesLength = data['MeanMensesLength']
        MeanCycleLength = data['MeanCycleLength']
        start_date_str = data['startDate']

        # Convert start date from string to datetime object
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid start date format. Please use YYYY-MM-DD.'}), 400

        # Fetch cycle number from the database based on email
        cycle_number = get_cycle_number_from_db(email)

        # Prepare input data for prediction (in the format the model expects)
        input_data = pd.DataFrame([{
            'CycleNumber': cycle_number,
            'MeanCycleLength': MeanCycleLength,
            'LengthofMenses': LengthofMenses,
            'MeanMensesLength': MeanMensesLength
        }])

        # Make prediction using the loaded model (assuming the model is loaded elsewhere)
        prediction = menses_model.predict(input_data)  # Ensure the model is properly loaded and accessible

        # Calculate predicted cycle length
        predicted_cycle_length = prediction[0]

        next_period_date = start_date + timedelta(days=prediction[0])

        # Prepare the response with the predicted cycle length
        response = {
            'next_period_date': next_period_date.strftime('%Y-%m-%d')
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/save_period_data', methods=['POST'])
def save_period_data():
    data = request.json
    print("Received data:", data)  # Log the incoming data for debugging

    email = data.get('email')
    if not email:
            return jsonify({'error': 'Email is required'}), 400

    LengthofMenses = data['LengthofMenses']
    MeanMensesLength = data['MeanMensesLength']
    LengthofCycle = data['LengthofCycle']
    MeanCycleLength = data['MeanCycleLength']
    start_date_str = data['startDate']

    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')

    # Fetch cycle number from the database based on email
    cycle_number = get_cycle_number_from_db(email)


    # Validate input data
    if not email or not start_date or not LengthofCycle or not MeanCycleLength or not LengthofMenses or not MeanMensesLength:
        print("Missing data!")
        return jsonify({"error": "Missing data"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO periods (email, cycle, period_start, period_length, mean_menses_length, cycle_length, mean_cycle_length)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (email, cycle_number, start_date, LengthofMenses, MeanMensesLength, LengthofCycle, MeanCycleLength))

        conn.commit()
        conn.close()

        return jsonify({"message": "Data added successfully"}), 201

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Load trained model and dataset
exercise_recommender_model = joblib.load("random_forest_model.pkl")
Exercise_data = pd.read_csv("Encoded_Exercise_Dataset.csv")

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
        exercise_type = request.json.get("exerciseType", "home")  # Get exercise type

        if weight <= 0 or height <= 0 or age <= 0:
            return jsonify({"error": "Invalid input values"}), 400

        # Calculate BMI
        bmi = weight / (height ** 2)

        # Prepare input data
        input_features = pd.DataFrame([[weight, height, bmi, age]], columns=["Weight", "Height", "BMI", "Age"])

        # Predict BMI case
        predicted_class = exercise_recommender_model.predict(input_features)[0]

        # Get exercise recommendations and BMI case
        exercise_data = Exercise_data.loc[Exercise_data['BMIcase_encoded'] == predicted_class]
        if not exercise_data.empty:
            bmi_case = exercise_data['BMIcase'].iloc[0]
            gym_exercise = exercise_data['Gym Exercise'].iloc[0]
            home_exercise = exercise_data['Home Exercise'].iloc[0]
        else:
            bmi_case = "Unknown"
            gym_exercise = "General workout"
            home_exercise = "Bodyweight exercises"

        # If exercise is not found, recommend visiting a doctor
        if not home_exercise or not gym_exercise:
            return jsonify({
                "error": "Recommended exercise not found. Please consult a doctor."
            }), 400

        # Return the exercise type chosen by the user
        if exercise_type == "home":
            recommended_exercise = home_exercise
        else:
            recommended_exercise = gym_exercise

        return jsonify({
            "bmi_case": bmi_case,
            "gym_exercise": gym_exercise,
            "home_exercise": home_exercise,
            "recommended_exercise": recommended_exercise  # Return recommended exercise based on choice
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
