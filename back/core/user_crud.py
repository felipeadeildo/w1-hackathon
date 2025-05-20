from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from core.security import get_password_hash, verify_password
from models.user import User


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    """Busca um usuário pelo email"""
    query = select(User).where(User.email == email)
    result = await session.exec(query)
    return result.one_or_none()


async def create_user(
    session: AsyncSession,
    email: str,
    password: str,
    is_consultant: bool = False,
) -> User:
    """Cria um novo usuário"""
    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        is_consultant=is_consultant,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def authenticate_user(session: AsyncSession, email: str, password: str) -> User | None:
    """Autentica um usuário pelo email e senha"""
    user = await get_user_by_email(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
