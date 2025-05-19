from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from core.config import settings

engine = create_engine(str(settings.DATABASE_URL), echo=True, pool_pre_ping=True)


def create_db_and_tables() -> None:
    """Creates all tables in the database"""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session]:
    """Dependency to get a DB session"""
    with Session(engine) as session:
        yield session
