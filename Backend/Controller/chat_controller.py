import os

from dotenv import load_dotenv
from fastapi import Request, Response
from langchain_openai import ChatOpenAI
from langchain_classic.chains import ConversationChain
from langchain_classic.memory import ConversationSummaryMemory
from model import ChatMessage

load_dotenv()

_llm = None
_memories: dict[str, object] = {}


def _get_llm():
    global _llm
    if _llm is None:

        _llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
    return _llm


def _get_conversation(user_key: str):

    if user_key not in _memories:
        _memories[user_key] = ConversationSummaryMemory(llm=_get_llm())

    return ConversationChain(llm=_get_llm(), memory=_memories[user_key], verbose=False)


async def chat_with_buddy(msg: ChatMessage, request: Request, response: Response):
    if not os.getenv("OPENAI_API_KEY"):
        response.status_code = 500
        return {
            "isSuccess": False,
            "msg": "OPENAI_API_KEY is not set on the server. Add it to Backend/.env",
        }

    try:
        user_state = getattr(request.state, "user", {}) or {}
        user_key = user_state.get("email", "anonymous")

        conversation = _get_conversation(user_key)
        reply = conversation.predict(input=msg.text)

        return {
            "isSuccess": True,
            "user": msg.text,
            "bot": reply,
            "summary_memory": _memories[user_key].load_memory_variables({})["history"],
        }

    except Exception as e:
        response.status_code = 500
        return {"isSuccess": False, "msg": str(e)}
