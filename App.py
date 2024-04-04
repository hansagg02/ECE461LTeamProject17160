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

def encrypt(inputText, N, D):
    # Check if N is >= 1
    if N < 1:
        return "Invalid value for N. N must be >= 1."

    # Check if D is either 1 (shift right) or -1 (shift left)
    if D not in [-1, 1]:
        return "Invalid value for D. D must be either 1 (shift right) or -1 (shift left)."

    encryptedText = ""
    for char in reversed(inputText):
        # If character is 'space' or '!', add it to the encrypted text without encryption
        if char in [' ', '!']:
            encryptedText += char
            continue
        
        # Shift the character by N positions in the specified direction
        shifted_char = chr(ord(char) + N * D)
        encryptedText += shifted_char

    return encryptedText

def decrypt(encryptedText, N, D):
    # Check if N is >= 1
    if N < 1:
        return "Invalid value for N. N must be >= 1."

    # Check if D is either 1 (shift right) or -1 (shift left)
    if D not in [-1, 1]:
        return "Invalid value for D. D must be either 1 (shift right) or -1 (shift left)."

    decryptedText = ""
    for char in reversed(encryptedText):
        # If character is 'space' or '!', add it to the decrypted text without decryption
        if char in [' ', '!']:
            decryptedText += char
            continue
        
        # Shift the character by N positions in the opposite direction
        shifted_char = chr(ord(char) - N * D)
        decryptedText += shifted_char

    return decryptedText

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    username = data.get('newUsername')
    newUserID = data.get('newUserID')  
    newPassword = data.get('newPassword')

    encrypted_ID = encrypt(newUserID, 3, 1)
    encrypted_password = encrypt(newPassword, 3, 1)

    # Check if user already exists
    if Database.user_exists(encrypted_ID):
        return jsonify({"error": "User already exists", "code": 409}), 409

    # Create the user in the database
    Database.create_user(username, encrypted_ID, encrypted_password)

    return jsonify({"message": "User created successfully", "code": 200}), 200

@app.route('/')
@cross_origin()
def index():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)




