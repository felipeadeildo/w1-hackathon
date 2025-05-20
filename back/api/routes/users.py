from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from api.schemas.user import Token, UserCreate, UserRead
from core.database import get_session
from core.security import create_access_token
from core.user_crud import authenticate_user, create_user, get_user_by_email
from models.user import User

router = APIRouter(
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, session: Annotated[Session, Depends(get_session)]) -> User:
    """Cria um novo usuário"""
    # Verifica se o email já existe
    existing_user = get_user_by_email(session, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado",
        )

    # TODO: definir uma base de dados fake com os clientes da w1.

    # Cria o usuário
    db_user = await create_user(
        session=session,
        email=user.email,
        password=user.password,
    )
    return db_user


@router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_session)],
) -> Token:
    """Login do usuário"""
    # Autentica o usuário
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verifica se o usuário está ativo
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário inativo",
        )

    # Gera o token de acesso
    access_token = create_access_token(user.id)
    return Token(access_token=access_token)
