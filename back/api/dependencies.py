from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from core.database import get_session
from core.security import verify_token
from models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], session: Annotated[Session, Depends(get_session)]
) -> User:
    """Obtém o usuário atual a partir do token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user_id = verify_token(token)
    if not user_id:
        raise credentials_exception

    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception

    return user


def get_current_consultant(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    """Verifica se o usuário atual é um consultor"""
    if not current_user.is_consultant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="O usuário não tem permissão para acessar este recurso",
        )
    return current_user
