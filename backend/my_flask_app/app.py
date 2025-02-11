from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS  # Import CORS

import MySQLdb

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'fempredict'
app.config['SECRET_KEY'] = 'your-secret-key'  # For session management

# Initialize MySQL
mysql = MySQL(app)

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Username, email, and password are required!"}), 400
    
    username = data['username']
    email = data['email']
    password = data['password']
    
    hashed_password = generate_password_hash(password)

    try:
        with mysql.connection.cursor() as cursor:
            cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({"message": "Email already exists!"}), 400

            cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)', (username, email, hashed_password))
            mysql.connection.commit()

        return jsonify({"message": "User registered successfully!"}), 201

    except MySQLdb.Error as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Login route
@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required!"}), 400

    try:
        with mysql.connection.cursor() as cursor:
            cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
            user = cursor.fetchone()

            if user and check_password_hash(user[3], password):  # Assuming the password is at index 3
                session['user_id'] = user[0]  # Store user id in the session
                return jsonify({"message": "Login successful!"}), 200
            else:
                return jsonify({"message": "Invalid email or password!"}), 401

    except MySQLdb.Error as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Get logged-in user's details
@app.route('/user', methods=['GET'])
def get_user_details():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"message": "User is not logged in!"}), 401

    try:
        with mysql.connection.cursor() as cursor:
            cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
            user = cursor.fetchone()

            if user:
                user_data = {
                    "id": user[0], 
                    "username": user[1], 
                    "email": user[2]
                }
                return jsonify({"user": user_data}), 200
            else:
                return jsonify({"message": "User not found!"}), 404

    except MySQLdb.Error as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Delete user's profile
@app.route('/delete_profile', methods=['DELETE'])
def delete_profile():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"message": "User is not logged in!"}), 401

    try:
        with mysql.connection.cursor() as cursor:
            # Delete the user's record from the database
            cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
            mysql.connection.commit()

            # Clear the session after deletion
            session.pop('user_id', None)

            return jsonify({"message": "User profile deleted successfully!"}), 200

    except MySQLdb.Error as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
