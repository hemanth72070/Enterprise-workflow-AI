from passlib.context import CryptContext
from pymongo import MongoClient

# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")

# Select database and collection
database = client["enterprise_workflow"]
users_collection = database["users"]

# Create new password hash
new_password = "admin@123"
password_hash = pwd_context.hash(new_password)

# Update only the admin user's password
result = users_collection.update_one(
    {"email": "admin@gmail.com"},
    {"$set": {"password_hash": password_hash}}
)

if result.matched_count == 1:
    print("Password reset successfully!")
    print("Email: admin@gmail.com")
    print("Password: admin@123")
else:
    print("User not found.")