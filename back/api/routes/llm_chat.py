from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from api.dependencies import (
    check_rate_limit,
    get_current_user,
    get_validated_user_step,
    validate_llm_chat_enabled,
)
from api.schemas.llm_chat import (
    ChatMessageRequest,
    ChatProgressResponse,
    ChatResetRequest,
    ChatStateResponse,
    MessageResponse,
    StreamMessageChunk,
    StructuredDataResponse,
)
from core.database import get_session
from core.llm_chat import llm_chat_service
from models.onboarding import UserOnboardingStep
from models.user import User

router = APIRouter(tags=["llm-chat"])


@router.post("/message/stream")
async def send_message_stream(
    request: ChatMessageRequest,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    user_step: Annotated[UserOnboardingStep, Depends(get_validated_user_step)],
    _: Annotated[None, Depends(validate_llm_chat_enabled)],
    __: Annotated[None, Depends(check_rate_limit)],
) -> StreamingResponse:
    """
    Envia uma mensagem para o chat LLM e retorna resposta em streaming.

    A resposta é enviada como Server-Sent Events (SSE) com chunks JSON.
    Cada chunk tem o formato:
    ```
    data: {"type": "message", "content": "texto parcial"}
    data: {"type": "structured_data", "data": {...}}
    data: {"type": "progress", "data": {...}}
    data: {"type": "complete"}
    ```
    """

    async def generate_stream() -> AsyncGenerator[str]:
        """Generator para streaming da resposta"""
        try:
            async for chunk in llm_chat_service.process_message_stream(
                session=session,
                user=current_user,
                user_step=user_step,
                message_content=request.message,
            ):
                # Envia chunk como JSON
                yield f"data: {chunk.model_dump_json()}\n\n"

        except Exception as e:
            # Em caso de erro, envia chunk de erro
            error_chunk = StreamMessageChunk(type="complete", content=f"Erro interno: {e!s}")
            yield f"data: {error_chunk.model_dump_json()}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/plain; charset=utf-8",
        },
    )


# === ROTA: ENVIAR MENSAGEM SEM STREAMING (PARA COMPATIBILIDADE) ===


@router.post("/message", response_model=dict)
async def send_message(
    request: ChatMessageRequest,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    user_step: Annotated[UserOnboardingStep, Depends(get_validated_user_step)],
    _: Annotated[None, Depends(validate_llm_chat_enabled)],
    __: Annotated[None, Depends(check_rate_limit)],
) -> ...:
    """
    Envia uma mensagem para o chat LLM e aguarda resposta completa.
    Use apenas quando não for possível usar streaming.
    """

    try:
        response_content = ""
        structured_data = None
        progress_data = None

        async for chunk in llm_chat_service.process_message_stream(
            session=session, user=current_user, user_step=user_step, message_content=request.message
        ):
            if chunk.type == "message":
                response_content = chunk.content
            elif chunk.type == "structured_data":
                structured_data = chunk.data
            elif chunk.type == "progress":
                progress_data = chunk.data

        return {
            "message": response_content,
            "structured_data": structured_data,
            "progress": progress_data,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar mensagem: {e!s}",
        ) from e


# === ROTA: OBTER ESTADO COMPLETO DO CHAT ===


@router.get("/state", response_model=ChatStateResponse)
async def get_chat_state(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    user_step: Annotated[UserOnboardingStep, Depends(get_validated_user_step)],
) -> ...:
    """
    Obtém o estado completo do chat LLM para o step atual.
    Inclui histórico de mensagens, dados estruturados e progresso.
    """

    try:
        state_data = await llm_chat_service.get_chat_state(
            session=session, user=current_user, user_step=user_step
        )

        return ChatStateResponse(**state_data)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter estado do chat: {e!s}",
        ) from e


# === ROTA: OBTER APENAS DADOS ESTRUTURADOS ===


@router.get("/structured-data", response_model=StructuredDataResponse)
async def get_structured_data(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    user_step: Annotated[UserOnboardingStep, Depends(get_validated_user_step)],
) -> ...:
    """
    Obtém apenas os dados estruturados extraídos do chat.
    Útil para refetch rápido no frontend.
    """

    try:
        structured_data = llm_chat_service.get_structured_data_from_step(user_step)
        return StructuredDataResponse(**structured_data.to_dict())

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter dados estruturados: {e!s}",
        ) from e


# === ROTA: OBTER PROGRESSO ===


@router.get("/progress", response_model=ChatProgressResponse)
async def get_chat_progress(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    user_step: Annotated[UserOnboardingStep, Depends(get_validated_user_step)],
) -> ...:
    """
    Obtém o progresso atual da coleta de dados.
    """

    try:
        structured_data = llm_chat_service.get_structured_data_from_step(user_step)
        progress = structured_data.get_progress()

        return progress

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter progresso: {e!s}",
        ) from e


# === ROTA: RESETAR CONVERSA ===


@router.post("/reset", response_model=dict)
async def reset_chat(
    request: ChatResetRequest,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    user_step: Annotated[UserOnboardingStep, Depends(get_validated_user_step)],
    _: Annotated[None, Depends(validate_llm_chat_enabled)],
) -> ...:
    """
    Reseta a conversa e todos os dados estruturados do chat LLM.
    ATENÇÃO: Esta ação é irreversível!
    """

    try:
        success = await llm_chat_service.reset_conversation(
            session=session, user=current_user, user_step=user_step
        )

        if success:
            return {"message": "Conversa resetada com sucesso"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao resetar conversa"
            )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao resetar conversa: {e!s}",
        ) from e


# === ROTA: OBTER HISTÓRICO DE MENSAGENS ===


@router.get("/messages", response_model=list[MessageResponse])
async def get_chat_messages(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    user_step: Annotated[UserOnboardingStep, Depends(get_validated_user_step)],
    limit: int = 50,
    offset: int = 0,
) -> ...:
    """
    Obtém histórico de mensagens do chat.
    Útil para paginação ou carregamento sob demanda.
    """

    try:
        from sqlmodel import desc, select

        from models.conversation import Conversation, Message

        # Busca conversa diretamente pelo step_id
        stmt = (
            select(Conversation)
            .where(
                Conversation.user_id == current_user.id,
                Conversation.is_llm == True,  # noqa: E712
                Conversation.onboarding_step_id == user_step.step_id,
            )
            .limit(1)
        )

        conversation = session.exec(stmt).first()

        if not conversation:
            return []

        # Busca mensagens
        stmt = (
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(desc(Message.created_at))
            .offset(offset)
            .limit(limit)
        )

        messages = session.exec(stmt).all()

        # Retorna em ordem cronológica
        return [
            MessageResponse(
                id=msg.id,
                sender_type=msg.sender_type.value,  # Adicionar .value para converter enum
                content=msg.content,
                created_at=msg.created_at,
            )
            for msg in reversed(messages)
        ]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter mensagens: {e!s}",
        ) from e
