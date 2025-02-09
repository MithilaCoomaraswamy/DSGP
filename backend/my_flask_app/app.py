from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash
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
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')
    
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
        
        return jsonify({"message": "User registered successfully!"}), 201
    except MySQLdb.Error as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()

if __name__ == '__main__':
    app.run(debug=True)
