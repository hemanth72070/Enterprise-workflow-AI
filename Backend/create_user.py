from database.mongodb import users_collection
from passlib.context import CryptContext


# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


email = "admin@gmail.com"
password = "admin123"
role = "Project Manager"


# Check whether user already exists
existing_user = users_collection.find_one({
    "email": email
})


if existing_user:
    print("User already exists.")
else:
    password_hash = pwd_context.hash(password)

    user = {
        "email": email,
        "password_hash": password_hash,
        "role": role
    }

    users_collection.insert_one(user)

    print("User created successfully!")
    print("Email:", email)
    print("Role:", role)