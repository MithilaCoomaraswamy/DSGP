from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import MySQLdb

app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'  # Your MySQL host
app.config['MYSQL_USER'] = 'root'  # Your MySQL username
app.config['MYSQL_PASSWORD'] = ''  # Your MySQL password
app.config['MYSQL_DB'] = 'user_data'  # The database you created

# Initialize MySQL
mysql = MySQL(app)

@app.route('/register', methods=['POST'])
def register_user():
    # Get the data from the request
    data = request.get_json()

    # Check if all required fields are present
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Name, email, and password are required!"}), 400
    
    name = data['name']
    email = data['email']
    password = data['password']
    
    # Hash the password
    hashed_password = generate_password_hash(password)

    # Open a MySQL connection and insert the user into the database
    try:
        cursor = mysql.connection.cursor()
        
        # Check if the email already exists
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({"message": "Email already exists!"}), 400

        # Insert the user data
        cursor.execute('INSERT INTO users (name, email, password) VALUES (%s, %s, %s)', (name, email, hashed_password))
        mysql.connection.commit()

        # Return success message
        return jsonify({"message": "User registered successfully!"}), 201

    except MySQLdb.Error as e:
        # Catch MySQL errors and provide a message
        return jsonify({"message": f"Error: {str(e)}"}), 500

    except Exception as e:
        # Catch any other errors
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

    finally:
        # Ensure the cursor is always closed
        cursor.close()

if __name__ == '__main__':
    app.run(debug=True)
