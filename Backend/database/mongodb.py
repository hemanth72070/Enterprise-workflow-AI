from pymongo import MongoClient


# MongoDB connection
MONGO_URL = "mongodb://localhost:27017/"

client = MongoClient(MONGO_URL)

# Database
database = client["enterprise_workflow"]

# Users collection
users_collection = database["users"]


def check_database_connection():
    try:
        client.admin.command("ping")
        return True
    except Exception as error:
        print("MongoDB connection error:", error)
        return False