from fastapi import APIRouter, Request, Response

from Controller.chat_controller import chat_with_buddy
from model import ChatMessage


ChatRouter = APIRouter()


@ChatRouter.post("/message")
async def send_message(msg: ChatMessage, request: Request, response: Response):
    return await chat_with_buddy(msg, request, response)
