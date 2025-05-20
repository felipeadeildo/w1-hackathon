from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import documents, holdings, users
from core.config import settings
from core.database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
    create_db_and_tables()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para sistema de gestão de holdings",
    version="0.1.0",
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(holdings.router, prefix="/api/holdings", tags=["holdings"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])


@app.get("/")
def read_root() -> dict:
    return {"message": "Bem-vindo ao sistema de gestão de holdings da W1"}


@app.get("/healthcheck", tags=["healthcheck"])
async def health_check() -> dict:
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
