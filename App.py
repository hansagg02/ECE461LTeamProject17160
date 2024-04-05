from flask import Flask, jsonify, request
from flask_cors import cross_origin, CORS

import Database

app = Flask(__name__, static_folder='./build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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

    encrypted_password = encrypt(newPassword, 3, 1)

    # Check if user already exists
    if Database.user_exists(newUserID):
        return jsonify({"error": "User already exists", "code": 409}), 409

    # Create the user in the database
    Database.create_user(username, newUserID, encrypted_password)

    return jsonify({"message": "User created successfully", "code": 200}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json

    username = data.get('username')
    userID = data.get('userID')  
    password = data.get('password')

    encrypted_password = encrypt(password, 3, 1)

    # Check if user credential matches database
    if Database.user_credentials_matched(userID, encrypted_password):
       return jsonify({"message": "User logged in successfully", "code": 200}), 200
        
    return jsonify({"message": "Invalid login credentials", "code": 401}), 401

@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.json
    projectName = data.get('projectName')
    description = data.get('description')
    projectID = data.get('projectID')
    userID = data.get('userID')

    # Check if user already exists
    if Database.project_exists(projectID):
        return jsonify({"error": "Project already exists", "code": 409}), 409
    
    Database.create_project(projectName, description, projectID, userID)
    return jsonify({"message": "Project created successfully", "code": 200}), 201

@app.route('/join_project', methods=['POST'])
def join_project():
    data = request.json
    projectID = data.get('joinProjectID')
    userID = data.get('userID')
    
     # Print projectID and userID for debugging
    print("Received projectID:", projectID)
    print("Received userID:", userID)

    # Check if project exists
    if not Database.project_exists(projectID):
        return jsonify({"error": "Project does not exist", "code": 409}), 409
    
    project_name = Database.get_project_name(userID, projectID)
    return jsonify({"projectName": project_name}), 200

@app.route('/')
@cross_origin()
def index():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)




