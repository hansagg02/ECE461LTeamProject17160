from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://nandrea:Spring2024@cluster0.8tk3g9l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
print("MongoDB URI: ", uri)

UserDB = client["Users"]
users = UserDB["users1"]

def user_exists(userID):
    if users.find_one({"id": userID}):
        return True
    return False

def create_user(username, userID, password):
    new_user = {
            "username" :username,
            "userID" :userID,
            "password" : password,
            "projects" : []
        }
    users.insert_one(new_user)
    print("User inserted successfully:", new_user)