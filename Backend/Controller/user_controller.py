from fastapi import Response

from model import User
from Utils import create_token, hash_password, verify_password

users: dict[str, dict] = {}


async def create_user(user: User, response: Response):
    try:
        if user.User_email in users:
            response.status_code = 400
            return {"isSuccess": False, "msg": "User already exists"}

        users[user.User_email] = {
            "name": user.User_name,
            "email": user.User_email,
            "password": hash_password(user.User_password),
        }

        response.status_code = 201
        return {"isSuccess": True, "msg": "User registered successfully"}

    except Exception as e:
        response.status_code = 500
        return {"isSuccess": False, "msg": str(e)}


async def login_user(User_email: str, User_password: str, response: Response):
    try:
        record = users.get(User_email)

        if not record or not verify_password(User_password, record["password"]):
            response.status_code = 400
            return {"isSuccess": False, "msg": "Invalid email or password"}

        token = create_token({"username": record["name"], "email": User_email})

        response.status_code = 200
        return {"isSuccess": True, "token": token, "msg": "Login successful"}

    except Exception as e:
        response.status_code = 500
        return {"isSuccess": False, "msg": str(e)}
