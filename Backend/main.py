from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from Router.chat_router import ChatRouter
from Router.user_router import UserRouter
from Utils import SECRET_KEY, decode_token

app = FastAPI(title="StudyBuddy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PUBLIC_PATHS = {"/", "/user/register", "/user/login", "/docs", "/openapi.json", "/redoc"}


@app.middleware("http")
async def auth(request: Request, call_next):
    # Browsers send a CORS preflight OPTIONS request with no Authorization
    # header. If we reject it here, the response never gets CORSMiddleware's
    # Access-Control-Allow-Origin header and the browser blocks the *real*
    # request that follows. Always let OPTIONS through untouched.
    if request.method == "OPTIONS" or request.url.path in PUBLIC_PATHS:
        return await call_next(request)

    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.lower().startswith("bearer "):
        return JSONResponse(
            status_code=401,
            content={"isSuccess": False, "msg": "Missing or invalid Authorization header"},
        )

    token = auth_header.split(" ", 1)[1]
    payload = decode_token(token, SECRET_KEY)

    if not payload or "error" in payload:
        return JSONResponse(
            status_code=403,
            content={"isSuccess": False, "msg": "Invalid or expired token"},
        )

    request.state.user = payload
    return await call_next(request)


app.include_router(UserRouter, prefix="/user", tags=["user"])
app.include_router(ChatRouter, prefix="/chat", tags=["chat"])


@app.get("/")
async def root():
    return {"message": "StudyBuddy API is running"}
