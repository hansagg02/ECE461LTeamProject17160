from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = "mongodb+srv://hzh853240936:<password>@cluster0.a7zaibg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    
def checkLogIn(username,password):
    return 0

def createUser(username,pasword):
    return 0

def getProject(projectID):
    return 0

def createProject(name,description,projectID):
    return 0

def operationHW(projectID,qty,index,flag):#check in qty to the index'th project in the projectID, with flag indicating checking in or out.
    return 0