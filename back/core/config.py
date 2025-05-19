from pydantic import AnyHttpUrl, PostgresDsn
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "W1 Holdings"
    API_V1_STR: str = "/api"

    # CORS
    CORS_ORIGINS: list[AnyHttpUrl] = []

    # Banco de dados
    DATABASE_URL: PostgresDsn | str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 dias

    # Upload de arquivos
    UPLOAD_FOLDER: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings(
    DATABASE_URL="sqlite:///./w1.db",
    SECRET_KEY="secret",
)
