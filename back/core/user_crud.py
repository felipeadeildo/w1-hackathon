from sqlmodel import Session, select

from core.security import get_password_hash, verify_password
from models.user import User, UserProfile


def get_user_by_email(session: Session, email: str) -> User | None:
    """Busca um usuário pelo email"""
    query = select(User).where(User.email == email)
    result = session.exec(query)
    return result.one_or_none()


async def create_user(
    session: Session,
    email: str,
    password: str,
    name: str,
    is_consultant: bool = False,
) -> User:
    """Cria um novo usuário com perfil"""
    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        is_consultant=is_consultant,
    )
    session.add(user)
    session.flush()  # Ensure user.id is available

    # Create user profile
    profile = UserProfile(user_id=user.id, full_name=name)
    session.add(profile)
    session.commit()
    session.refresh(user)
    return user


def authenticate_user(session: Session, email: str, password: str) -> User | None:
    """Autentica um usuário pelo email e senha"""
    user = get_user_by_email(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
