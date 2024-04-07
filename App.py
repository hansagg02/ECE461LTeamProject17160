import os

from flask import Flask, jsonify, request
from flask_cors import cross_origin, CORS

import main
import Database

app = Flask(__name__, static_folder='./build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/check_credentials', methods=['POST'])
def check_credentials():
    data = request.get_json()
    acc = data['acc']
    password = data['password']
    encrypted_acc = main.encrypt(acc, 3, 1)
    encrypted_password = main.encrypt(password, 3, 1)  # Encrypt the password using the encrypt function

    with open('src\database.txt', 'r') as file:
        for line in file:
            stored_acc, stored_password = line.strip().split(' ')
            if encrypted_acc == stored_acc and encrypted_password == stored_password:
                return jsonify({'authenticated': True}) 

    return jsonify({'authenticated': False})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    username = data.get('newUsername')
    newUserID = data.get('newUserID')  
    newPassword = data.get('newPassword')

    # Check if user already exists
    if Database.user_exists(newUserID):
        return jsonify({"error": "User already exists", "code": 409}), 409

    # Encrypt the password
    encrypted_password = main.encrypt(newPassword)

    # Create the user in the database
    Database.create_user(username, newUserID, encrypted_password)

    return jsonify({"message": "User created successfully", "code": 200}), 200

@app.route('/')
@cross_origin()
def index():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT',80))




