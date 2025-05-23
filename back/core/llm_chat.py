import uuid
from collections.abc import AsyncGenerator
from datetime import UTC, datetime

from pydantic_ai import Agent, RunContext
from pydantic_ai.messages import (
    ModelMessage,
    ModelRequest,
    ModelResponse,
    SystemPromptPart,
    TextPart,
    UserPromptPart,
)
from sqlmodel import Session, asc, select

from api.schemas.llm_chat import (
    ChatStructuredData,
    ImovelData,
    InvestimentoData,
    MembroFamiliaData,
    OutroAtivoData,
    ParticipacaoSocietariaData,
    StreamMessageChunk,
)
from models.conversation import Conversation, Message, SenderType
from models.onboarding import OnboardingStepType, UserOnboardingStep
from models.user import User


class LLMChatService:
    """Service para gerenciar chat com LLM no onboarding"""

    def __init__(self) -> None:
        self.agent = self._create_agent()

    def _create_agent(self) -> Agent[ChatStructuredData, str]:
        """Cria o agente LLM com as tools necessárias"""

        agent = Agent(
            "openai:gpt-4o-mini",
            deps_type=ChatStructuredData,
            system_prompt="""
            Você é um assistente especializado em estruturação patrimonial para criação de holdings.

            Sua função é conversar naturalmente com o usuário e extrair informações sobre:
            1. Imóveis (tipo, localização, valor, status de uso, área, data de aquisição)
            2. Participações societárias (empresa, participação, faturamento, CNPJ, posição)
            3. Estrutura familiar (estado civil, cônjuge, filhos, regime de bens)
            4. Investimentos (tipo, valor, detalhes, instituição)
            5. Outros ativos (veículos, obras de arte, etc.)

            IMPORTANTE:
            - Sempre que identificar informações suficientes sobre qualquer item, utilize as ferramentas para estruturar os dados
            - Seja natural na conversa, não robotizado
            - Faça perguntas para esclarecer informações quando necessário
            - Quando o usuário fornecer informações parciais, adicione o que conseguir e pergunte pelos detalhes faltantes
            - Use as ferramentas mesmo com informações incompletas - é melhor ter algo estruturado do que nada
            - Sempre confirme os dados antes de adicioná-los

            Seja sempre cordial, profissional e didático. Explique a importância de cada informação para a estruturação patrimonial.

            Sempre que fizer algo, alguma ação, sugira a próxima ação, com base nas tools.
            """,  # noqa
        )

        # === TOOLS PARA IMÓVEIS ===

        @agent.tool
        async def adicionar_imovel(
            ctx: RunContext[ChatStructuredData],
            tipo: str,
            localizacao: str,
            status: str,
            valor_estimado_str: str | None = None,
            renda_mensal_str: str | None = None,
            area: str | None = None,
            data_aquisicao: str | None = None,
            observacoes: str | None = None,
        ) -> str:
            """Adiciona um novo imóvel à lista de bens."""

            imovel = ImovelData(
                tipo=tipo,
                valor_estimado=float(valor_estimado_str) if valor_estimado_str else None,
                renda_mensal=float(renda_mensal_str) if renda_mensal_str else None,
                localizacao=localizacao,
                status=status,
                valor_estimado_str=valor_estimado_str,
                renda_mensal_str=renda_mensal_str,
                area=area,
                data_aquisicao=data_aquisicao,
                observacoes=observacoes,
            )

            ctx.deps.imoveis.append(imovel)
            return f"Imóvel adicionado: {tipo} em {localizacao}"

        @agent.tool
        async def atualizar_imovel(
            ctx: RunContext[ChatStructuredData], indice: int, **kwargs
        ) -> str:
            """Atualiza dados de um imóvel existente."""

            if 0 <= indice < len(ctx.deps.imoveis):
                imovel = ctx.deps.imoveis[indice]
                for key, value in kwargs.items():
                    if hasattr(imovel, key) and value is not None:
                        setattr(imovel, key, value)
                return f"Imóvel {indice + 1} atualizado"
            return "Índice de imóvel inválido"

        # === TOOLS PARA PARTICIPAÇÕES SOCIETÁRIAS ===

        @agent.tool
        async def adicionar_participacao(
            ctx: RunContext[ChatStructuredData],
            empresa: str,
            segmento: str,
            participacao: str,
            faturamento_anual: str | None = None,
            cnpj: str | None = None,
            posicao: str | None = None,
            data_criacao: str | None = None,
            observacoes: str | None = None,
        ) -> str:
            """Adiciona uma nova participação societária."""

            participacao_obj = ParticipacaoSocietariaData(
                empresa=empresa,
                segmento=segmento,
                participacao=participacao,
                faturamento_anual=faturamento_anual,
                cnpj=cnpj,
                posicao=posicao,
                data_criacao=data_criacao,
                observacoes=observacoes,
            )

            ctx.deps.participacoes.append(participacao_obj)
            return f"Participação societária adicionada: {empresa} ({participacao})"

        # === TOOLS PARA ESTRUTURA FAMILIAR ===

        @agent.tool
        async def atualizar_estrutura_familiar(
            ctx: RunContext[ChatStructuredData],
            estado_civil: str | None = None,
            regime_bens: str | None = None,
            observacoes: str | None = None,
        ) -> str:
            """Atualiza informações gerais da estrutura familiar."""

            if estado_civil and ctx.deps.estrutura_familiar:
                ctx.deps.estrutura_familiar.estado_civil = estado_civil
            if regime_bens and ctx.deps.estrutura_familiar:
                ctx.deps.estrutura_familiar.regime_bens = regime_bens
            if observacoes and ctx.deps.estrutura_familiar:
                ctx.deps.estrutura_familiar.observacoes = observacoes

            return "Estrutura familiar atualizada"

        @agent.tool
        async def adicionar_conjuge(
            ctx: RunContext[ChatStructuredData],
            nome: str,
            idade: int | None = None,
            ocupacao: str | None = None,
            cpf: str | None = None,
            observacoes: str | None = None,
        ) -> str:
            """Adiciona informações do cônjuge."""

            conjuge = MembroFamiliaData(
                nome=nome,
                parentesco="cônjuge",
                idade=idade,
                ocupacao=ocupacao,
                cpf=cpf,
                observacoes=observacoes,
            )

            if ctx.deps.estrutura_familiar:
                ctx.deps.estrutura_familiar.conjuge = conjuge
            return f"Cônjuge adicionado: {nome}"

        @agent.tool
        async def adicionar_filho(
            ctx: RunContext[ChatStructuredData],
            nome: str,
            idade: int | None = None,
            ocupacao: str | None = None,
            cpf: str | None = None,
            observacoes: str | None = None,
        ) -> str:
            """Adiciona um filho à estrutura familiar."""

            filho = MembroFamiliaData(
                nome=nome,
                parentesco="filho",
                idade=idade,
                ocupacao=ocupacao,
                cpf=cpf,
                observacoes=observacoes,
            )

            if ctx.deps.estrutura_familiar:
                ctx.deps.estrutura_familiar.filhos.append(filho)
            return f"Filho adicionado: {nome}"

        @agent.tool
        async def adicionar_dependente(
            ctx: RunContext[ChatStructuredData],
            nome: str,
            parentesco: str,
            idade: int | None = None,
            ocupacao: str | None = None,
            cpf: str | None = None,
            observacoes: str | None = None,
        ) -> str:
            """Adiciona outro dependente à estrutura familiar."""

            dependente = MembroFamiliaData(
                nome=nome,
                parentesco=parentesco,
                idade=idade,
                ocupacao=ocupacao,
                cpf=cpf,
                observacoes=observacoes,
            )

            if ctx.deps.estrutura_familiar:
                ctx.deps.estrutura_familiar.outros_dependentes.append(dependente)
            return f"Dependente adicionado: {nome} ({parentesco})"

        # === TOOLS PARA INVESTIMENTOS ===

        @agent.tool
        async def adicionar_investimento(
            ctx: RunContext[ChatStructuredData],
            tipo: str,
            valor_str: str | None = None,
            detalhes: str | None = None,
            instituicao: str | None = None,
            data_aplicacao: str | None = None,
            observacoes: str | None = None,
        ) -> str:
            """Adiciona um investimento ou ativo financeiro."""

            investimento = InvestimentoData(
                valor=float(valor_str) if valor_str else None,
                tipo=tipo,
                valor_str=valor_str,
                detalhes=detalhes,
                instituicao=instituicao,
                data_aplicacao=data_aplicacao,
                observacoes=observacoes,
            )

            ctx.deps.investimentos.append(investimento)
            return f"Investimento adicionado: {tipo}"

        # === TOOLS PARA OUTROS ATIVOS ===

        @agent.tool
        async def adicionar_outro_ativo(
            ctx: RunContext[ChatStructuredData],
            tipo: str,
            descricao: str,
            valor_str: str | None = None,
            observacoes: str | None = None,
        ) -> str:
            """Adiciona outros tipos de ativos (veículos, obras de arte, etc.)."""

            ativo = OutroAtivoData(
                tipo=tipo,
                descricao=descricao,
                valor_str=valor_str,
                observacoes=observacoes,
                valor=float(valor_str) if valor_str else None,
            )

            ctx.deps.outros_ativos.append(ativo)
            return f"Ativo adicionado: {tipo} - {descricao}"

        # === TOOL PARA OBTER RESUMO ===

        @agent.tool
        async def obter_resumo_dados(ctx: RunContext[ChatStructuredData]) -> str:
            """Retorna um resumo dos dados coletados até agora."""

            resumo = f"""
            Resumo dos dados coletados:

            📍 Imóveis: {len(ctx.deps.imoveis)} item(s)
            🏢 Participações Societárias: {len(ctx.deps.participacoes)} item(s)
            👨‍👩‍👧‍👦 Estrutura Familiar: {"Configurada" if ctx.deps.estrutura_familiar and ctx.deps.estrutura_familiar.estado_civil else "Pendente"}
            💰 Investimentos: {len(ctx.deps.investimentos)} item(s)
            🎯 Outros Ativos: {len(ctx.deps.outros_ativos)} item(s)
            """  # noqa

            return resumo

        return agent

    # === MÉTODOS DO SERVICE ===

    async def get_or_create_conversation(
        self, session: Session, user_id: uuid.UUID, step_id: int
    ) -> Conversation:
        """Obtém ou cria uma conversa para o step LLM"""

        # Busca conversa existente para este step
        stmt = (
            select(Conversation)
            .where(
                Conversation.user_id == user_id,
                Conversation.is_llm == True,  # noqa: E712
                Conversation.onboarding_step_id == step_id,
            )
            .limit(1)
        )

        conversation = session.exec(stmt).first()

        if not conversation:
            # Cria nova conversa
            conversation = Conversation(
                user_id=user_id,
                title=f"Chat LLM - Step {step_id}",
                is_llm=True,
                onboarding_step_id=step_id,
            )
            session.add(conversation)
            session.commit()
            session.refresh(conversation)

        return conversation

    def get_structured_data_from_step(self, user_step: UserOnboardingStep) -> ChatStructuredData:
        """Extrai dados estruturados do step"""

        if user_step.data and "structured_data" in user_step.data:
            return ChatStructuredData.model_validate(user_step.data["structured_data"])

        return ChatStructuredData()

    def save_structured_data_to_step(
        self, session: Session, user_step: UserOnboardingStep, structured_data: ChatStructuredData
    ) -> None:
        """Salva dados estruturados no step"""

        if not user_step.data:
            user_step.data = {}

        user_step.data["structured_data"] = structured_data.model_dump()
        user_step.data["last_updated"] = datetime.now(UTC).isoformat()

        session.add(user_step)
        session.commit()
        session.refresh(user_step)

    async def process_message_stream(
        self, session: Session, user: User, user_step: UserOnboardingStep, message_content: str
    ) -> AsyncGenerator[StreamMessageChunk]:
        """Processa mensagem com streaming da resposta"""

        # Verifica se é step de LLM
        if user_step.step.type != OnboardingStepType.LLM_CHAT:
            yield StreamMessageChunk(type="complete", content="Este step não é de chat LLM")
            return

        # Obtém ou cria conversa
        conversation = await self.get_or_create_conversation(session, user.id, user_step.step_id)

        # Salva mensagem do usuário
        user_message = Message(
            conversation_id=conversation.id,
            sender_id=user.id,
            sender_type=SenderType.USER,
            content=message_content,
        )
        session.add(user_message)
        session.commit()

        # Obtém dados estruturados atuais
        structured_data = self.get_structured_data_from_step(user_step)

        # Obtém histórico de mensagens para contexto
        message_history = self._get_message_history(session, conversation.id)

        try:
            # Processa com o agente LLM
            full_response = ""
            async with self.agent.run_stream(
                message_content, deps=structured_data, message_history=message_history
            ) as result:
                async for chunk in result.stream_text(debounce_by=0.01):
                    full_response = chunk
                    yield StreamMessageChunk(type="message", content=chunk)

                # Quando terminar, salva a resposta
                llm_message = Message(
                    conversation_id=conversation.id,
                    sender_type=SenderType.LLM,
                    content=full_response,
                )
                session.add(llm_message)

                self.save_structured_data_to_step(session, user_step, structured_data)

                yield StreamMessageChunk(type="structured_data", data=structured_data.model_dump())

                yield StreamMessageChunk(type="complete")

        except Exception as e:
            error_message = Message(
                conversation_id=conversation.id,
                sender_type=SenderType.LLM,
                content=f"Desculpe, ocorreu um erro: {e!s}",
            )
            session.add(error_message)
            session.commit()

            yield StreamMessageChunk(type="complete", content=f"Erro: {e!s}")

    def _get_message_history(
        self, session: Session, conversation_id: uuid.UUID
    ) -> list[ModelMessage]:
        """Obtém histórico de mensagens para contexto do LLM"""

        stmt = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(asc(Message.created_at))
            .limit(30)
        )

        messages = session.exec(stmt).all()

        # Converte para formato do PydanticAI
        model_messages = []

        for msg in messages:
            if msg.sender_type == SenderType.USER:
                # Mensagem do usuário vira ModelRequest com UserPromptPart
                model_messages.append(
                    ModelRequest(
                        parts=[
                            UserPromptPart(
                                content=msg.content,
                                timestamp=msg.created_at,
                            )
                        ]
                    )
                )
            elif msg.sender_type == SenderType.LLM:
                # Mensagem do LLM vira ModelResponse com TextPart
                model_messages.append(
                    ModelResponse(
                        parts=[
                            TextPart(
                                content=msg.content,
                            )
                        ],
                        timestamp=msg.created_at,
                    )
                )
            elif msg.sender_type == SenderType.SYSTEM:
                model_messages.append(
                    ModelRequest(
                        parts=[
                            SystemPromptPart(
                                content=msg.content,
                                timestamp=msg.created_at,
                            )
                        ]
                    )
                )
            # Ignora outros tipos como CONSULTANT por enquanto

        return model_messages

    async def reset_conversation(
        self, session: Session, user: User, user_step: UserOnboardingStep
    ) -> bool:
        """Reseta a conversa e dados estruturados"""

        try:
            # Obtém conversa
            conversation = await self.get_or_create_conversation(
                session, user.id, user_step.step_id
            )

            # Remove todas as mensagens
            stmt = select(Message).where(Message.conversation_id == conversation.id)
            messages = session.exec(stmt).all()

            for message in messages:
                session.delete(message)

            # Reseta dados estruturados
            if user_step.data:
                user_step.data.pop("structured_data", None)

            # Marca step como não completo
            user_step.is_completed = False
            user_step.completed_at = None

            session.commit()
            return True

        except Exception as e:
            session.rollback()
            raise e


# Instância global do service
llm_chat_service = LLMChatService()
