# StudyBuddy — Mini Project

A small full-stack app: React (Vite) frontend + FastAPI backend, with JWT auth
and an AI chat assistant ("StudyBuddy") powered by LangChain + OpenAI.

```
StudyBuddy/
├── Backend/                 FastAPI app
│   ├── main.py               app entry point, CORS, auth middleware
│   ├── model.py               pydantic request/response models
│   ├── Utils.py                password hashing + JWT helpers
│   ├── requirements.txt
│   ├── .env.example
│   ├── Controller/
│   │   ├── user_controller.py  register/login logic
│   │   └── chat_controller.py  StudyBuddy AI chat logic
│   └── Router/
│       ├── user_router.py      /user/register, /user/login
│       └── chat_router.py      /chat/message
└── Study_Budy_Frontend/     React + Vite app
    └── src/
        ├── App.jsx            routes (was empty before — app didn't render)
        ├── api.js             axios instance, auto-attaches JWT
        ├── Signup.jsx
        ├── Login.jsx
        └── Dashboard.jsx      the chat UI (new — didn't exist before)
```

## What was fixed

**Backend**
- `create_tokan`/`decode_tokan` typos that didn't match the real function
  names in `Utils.py` — these caused import errors.
- `CORSMiddleware` was imported but never registered — the frontend could
  never call the API at all.
- The auth middleware whitelisted `/user/login` and `/user/register`, but the
  actual routes were `/post_user` and `/login_user` — nothing lined up, so
  every request (including login itself) was rejected. Routes are now
  consistently mounted under `/user/...` and `/chat/...`.
- Tokens were signed with `"my secret key"` but verified with `"ww"` — two
  different secrets, so no token ever passed verification. There's now one
  shared `SECRET_KEY` (from `Utils.py`, overridable via `.env`).
- The auth middleware read the header as `request["headers"][0][1]`, which is
  fragile and wrong. It now uses `request.headers.get("authorization")`.
- `study_budy.py` was a second, disconnected FastAPI app using the
  non-existent `langchain_classic` package. It's now a proper
  `Controller`/`Router` pair (`chat_controller.py` / `chat_router.py`) mounted
  into the main app under `/chat/message`, using the real `langchain` /
  `langchain_openai` packages, with per-user conversation memory.
- Removed a large block of dead, commented-out code in `Utils.py`.

**Frontend**
- `src/App.jsx` was completely empty — the app had no routes and rendered
  nothing. It now sets up `/` (Signup), `/log` (Login), and `/dashboard`
  (the new chat page, protected by a simple auth check).
- Fixed `classNameName` → `className` typos in `Login.jsx` and `Signup.jsx`.
- `for=` attributes changed to `htmlFor=` (React/JSX convention).
- `package.json` was missing `axios` and `react-router-dom`, which the code
  already depended on — added both. Bootstrap CSS is now loaded via CDN in
  `index.html` since Bootstrap classes were used but never loaded.
- Login pointed to a leftover `/expense` route from an older project
  template; it now goes to `/dashboard`.
- Added a `Dashboard.jsx` page — the StudyBuddy chat screen didn't exist
  anywhere in the original frontend.
- Requests now go through a shared `api.js` axios instance that automatically
  attaches the saved JWT as an `Authorization: Bearer <token>` header.

## Running it

### 1. Backend

```bash
cd Backend
python -m venv venv
source venv/bin/activate        # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env            # then edit .env with a real JWT secret + OpenAI key
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Interactive docs at `/docs`.

> The `/chat/message` endpoint needs `OPENAI_API_KEY` set in `.env`.
> Registration and login work without it.

### 2. Frontend

```bash
cd Study_Budy_Frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### Flow

1. Go to `/` → register an account.
2. You're taken to `/log` → log in.
3. On success you land on `/dashboard` and can chat with StudyBuddy.

## Known limitations (worth knowing about for a mini project)

- Users are stored **in memory** — they disappear when the backend restarts.
  Fine for a demo; swap in SQLite/Postgres for anything persistent.
- The JWT secret defaults to a placeholder value — always set a real
  `JWT_SECRET_KEY` before deploying anywhere public.
- No refresh-token flow — tokens are valid indefinitely once issued (add
  expiry via `jwt.encode`'s `exp` claim if you want that).
