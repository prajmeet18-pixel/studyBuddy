from fastapi import APIRouter, Response

from Controller.user_controller import create_user, login_user
from model import LoginRequest, User

UserRouter = APIRouter()


@UserRouter.post("/register")
async def register(user: User, response: Response):
    return await create_user(user, response)


@UserRouter.post("/login")
async def login(payload: LoginRequest, response: Response):
    return await login_user(payload.User_email, payload.User_password, response)

