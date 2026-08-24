from pymongo import MongoClient

# MongoDB connection URL
MONGO_URL = "mongodb://localhost:27017"

# Create MongoDB client
client = MongoClient(MONGO_URL)

# Select database
database = client["enterprise_ai"]

# Collections
users_collection = database["users"]
projects_collection = database["projects"]
tasks_collection = database["tasks"]


def test_database_connection():
    try:
        client.admin.command("ping")
        print("MongoDB connection successful!")
        return True

    except Exception as error:
        print("MongoDB connection failed:", error)
        return Falsecd "C:\Users\ADMIN\OneDrive\Desktop\EnterpriseAI\enterprise-ai-demo"