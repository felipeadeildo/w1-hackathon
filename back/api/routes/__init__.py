from .documents import router as documents_router
from .holdings import router as holdings_router
from .onboarding import router as onboarding_router
from .users import router as users_router

__all__ = ["documents_router", "holdings_router", "onboarding_router", "users_router"]
