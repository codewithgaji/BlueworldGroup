from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core import config
from routers import auth

app = FastAPI(title="BlueWorld Cosmetics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.get("/health")
def health():
    return {"status": "ok"}