import os
from dotenv import load_dotenv

load_dotenv()  # reads app/.env into the process environment — must run before any os.getenv() call

DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set — check that app/.env exists and is being loaded.")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET is not set — check that app/.env exists and is being loaded.")