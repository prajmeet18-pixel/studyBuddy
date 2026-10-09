from pydantic import BaseModel, EmailStr


class User(BaseModel):
    """Payload for registering a new user."""
    User_name: str
    User_email: EmailStr
    User_password: str


class LoginRequest(BaseModel):
    """Payload for logging a user in."""
    User_email: EmailStr
    User_password: str


class ChatMessage(BaseModel):
    """A single message sent to the StudyBuddy chatbot."""
    text: str
