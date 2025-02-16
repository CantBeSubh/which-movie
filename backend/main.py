from fastapi import FastAPI
from src.endpoints import router

app = FastAPI()

app.include_router(router)
