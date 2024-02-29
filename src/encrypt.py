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

def check_credentials(acc, password):
    encrypted_password = encrypt(password, 3, 1)  # Encrypt the password using the encrypt function
    with open('database.txt', 'r') as file:
        for line in file:
            stored_acc, stored_password = line.strip().split(',')
            if acc == stored_acc and encrypted_password == stored_password:
                return True
    return False