from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://nandrea:Spring2024@cluster0.8tk3g9l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

ResourceDB = client["Resource"]
hardware_sets = ResourceDB["Hardware"]

def initialize_hardware_set_database():
    hardware_set1 = {
        "name": "HWSet1", 
        "capacity": 100, 
        "availability": 100
    }
    # Insert HWSet1 if not in database
    if not hardware_sets.find_one({"name": "HWSet1"}):
        hardware_sets.insert_one(hardware_set1)
    
    hardware_set2 = {
        "name": "HWSet2", 
        "capacity": 100, 
        "availability": 100
    }
    # Insert HWSet2 if not in database
    if not hardware_sets.find_one({"name": "HWSet2"}):
        hardware_sets.insert_one(hardware_set2)
 
initialize_hardware_set_database()

UserDB = client["Users"]
users = UserDB["users1"]

def user_exists(userID):
    if users.find_one({"userID": userID}):
        return True
    return False

def password_exists(password):
    if users.find_one({"password": password}):
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
    myquery = {"userID": userID}
    user = users.find_one(myquery)
    if user["password"] == password:
        return True
    else:
        return False
    
def update_username(userID, username):
    myquery = {"userID": userID}
    user = users.find_one(myquery)
    if user["username"] != username:
        users.update_one(myquery, {"$set": {"username": username}})
    return
    
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
            "projectID" : projectID
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

def fetch_hardware_set(hw_set_name):
    hw_set = hardware_sets.find_one({"name": hw_set_name})
    return hw_set

def update_checkin_availability(hw_set_name, quantity):
    hw_set = hardware_sets.find_one({"name": hw_set_name})
    current_availability = hw_set['availability']
    updated_availability = current_availability + quantity
    if updated_availability > hw_set['capacity']:
        return False
    else:
        hardware_sets.update_one({"name": hw_set_name}, {"$set": {"availability": updated_availability}})
        return True
    
def update_checkout_availability(hw_set_name, quantity):
    hw_set = hardware_sets.find_one({"name": hw_set_name})
    current_availability = hw_set['availability']
    updated_availability = current_availability - quantity
    if updated_availability < 0:
        return False
    else:
        hardware_sets.update_one({"name": hw_set_name}, {"$set": {"availability": updated_availability}})
        return True
    


    
    
    