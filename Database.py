from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://nandrea:Spring2024@cluster0.8tk3g9l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
print("MongoDB URI: ", uri)

UserDB = client["Users"]
users = UserDB["users1"]

def user_exists(userID):
    if users.find_one({"userID": userID}):
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
    

def user_credentials_matched(userID, password):
    if not user_exists(userID):
        return False
    myquery={"userID": userID}
    user = users.find_one(myquery)
    if user["password"] == password:
        return True
    else:
        return False
    
ProjectDB = client["Projects"]
projects = ProjectDB["project1"]
    
def project_exists(projectID):
    if projects.find_one({"projectID": projectID}):
        return True
    return False

def create_project(projectName, description, projectID, userID):
    new_project = {
            "projectName" :projectName,
            "description" :description,
            "projectID" : projectID,
        }
    projects.insert_one(new_project)
    # Add project to user
    users.update_one({"userID": userID}, {"$push": {"projects": projectID}})

def get_project_name(userID, projectID):
    user = users.find_one({"userID": userID})
    user_projects = user.get('projects', [])
    # Add projectID to user if it is not associated with them already
    if not projectID in user_projects:
        users.update_one({"userID": userID}, {"$push": {"projects": projectID}})
    project = projects.find_one({"projectID": projectID})
    project_name = project.get('projectName')
    return project_name
    

    
    
    