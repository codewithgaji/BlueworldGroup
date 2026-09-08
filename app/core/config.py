import os
from dotenv import load_dotenv

load_dotenv()  # reads app/.env into the process environment — must run before any os.getenv() call

DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",")

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
CLOUDINARY_UPLOAD_FOLDER = os.getenv("CLOUDINARY_UPLOAD_FOLDER", "blueworld")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set — check that app/.env exists and is being loaded.")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET is not set — check that app/.env exists and is being loaded.")
if not (CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET):
    raise RuntimeError("Cloudinary credentials are incomplete — check CLOUDINARY_* vars in app/.env.")