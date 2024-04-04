from flask import Flask, request, jsonify
from flask_cors import CORS
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

app = Flask(__name__)
CORS(app)
@app.route('/api/check_credentials', methods=['POST'])
def check_credentials():
    data = request.get_json()
    acc = data['acc']
    password = data['password']
    encrypted_acc = encrypt(acc, 3, 1)
    encrypted_password = encrypt(password, 3, 1)  # Encrypt the password using the encrypt function

    with open('src\database.txt', 'r') as file:
        for line in file:
            stored_acc, stored_password = line.strip().split(' ')
            if encrypted_acc == stored_acc and encrypted_password == stored_password:
                return jsonify({'authenticated': True}) 

    return jsonify({'authenticated': False})

if __name__ == '__main__':
    app.run(port=3000)


def newUser():#call this when creating new acc
    return 0

def createNewProject():
    return 0

projecID=''
def useExistingProject():#check if provided project id exist, set value of projectID if exist, then call getProject() to preceed to the HWView page
    return 0

def checkIn():
    return 0

def checkOut():
    return 0







