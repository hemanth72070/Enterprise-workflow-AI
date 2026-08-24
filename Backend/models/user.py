from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "Project Manager"


class UserLogin(BaseModel):
    email: EmailStr
    password: str