from fastapi import APIRouter

router = APIRouter(
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def root() -> dict:
    return {"message": "Hello World!"}
