from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext

from models.user import UserLogin
from database.mongodb import users_collection
from security.auth import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


@router.post("/login")
def login(request: UserLogin):

    # Find user in MongoDB
    user = users_collection.find_one({
        "email": request.email
    })

    # User doesn't exist
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    password_valid = pwd_context.verify(
        request.password,
        user["password_hash"]
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT token
    access_token = create_access_token({
        "email": user["email"],
        "role": user.get(
            "role",
            "Project Manager"
        )
    })

    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "role": user.get(
                "role",
                "Project Manager"
            )
        }
    }