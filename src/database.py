from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
uri = "mongodb+srv://hzh853240936:ETB434x5MsiVYVPT@cluster0.a7zaibg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

def checkLogIn(username,password,id):
    db = client.get_database("UserLoginCredentials")
    if username in db.list_collection_names:
        user = db.get_collection(username)
        myquery = {"userID": id, "password": password}
        if user.find_one(myquery) is None: 
            return False
        return True
    return False

def createUser(username,password,id):
    db = client.get_database("UserLoginCredentials")
    collection = db[username] 
    userDocument = {
        "userID": id,
        "password": password,
        "datecreated": datetime.now(),
    }    
    collection.insert_one(userDocument)

def getProject(projectID):
    return 0

def createProject(name,description,projectID):
    return 0

def operationHW(projectID,qty,index,flag):#check in qty to the index'th project in the projectID, with flag indicating checking in or out.
    return 0
# Yes sir 