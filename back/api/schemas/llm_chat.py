# api/schemas/llm_chat.py
import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

# === SCHEMAS DE REQUEST ===


class ChatMessageRequest(BaseModel):
    """Request para enviar mensagem no chat LLM"""

    message: str = Field(..., min_length=1, max_length=2000)
    step_id: int = Field(..., description="ID do step de onboarding")


class ChatResetRequest(BaseModel):
    """Request para resetar conversa do chat LLM"""

    step_id: int = Field(..., description="ID do step de onboarding")


# === SCHEMAS DE RESPONSE ===


class MessageResponse(BaseModel):
    """Response de uma mensagem individual"""

    id: uuid.UUID
    sender_type: str  # user | llm
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class StructuredDataResponse(BaseModel):
    """Response dos dados estruturados extraídos"""

    imoveis: list[dict[str, Any]] = Field(default_factory=list)
    participacoes: list[dict[str, Any]] = Field(default_factory=list)
    estrutura_familiar: dict[str, Any] = Field(default_factory=dict)
    investimentos: list[dict[str, Any]] = Field(default_factory=list)
    outros_ativos: list[dict[str, Any]] = Field(default_factory=list)


class ChatProgressResponse(BaseModel):
    """Response do progresso do chat"""

    completed_sections: int = Field(default=0)
    total_sections: int = Field(default=5)
    percentage: int = Field(default=0)
    missing_data: list[str] = Field(default_factory=list)


class ChatStateResponse(BaseModel):
    """Response do estado completo do chat"""

    conversation_id: uuid.UUID
    messages: list[MessageResponse]
    structured_data: StructuredDataResponse
    progress: ChatProgressResponse
    is_completed: bool = Field(default=False)


class StreamMessageChunk(BaseModel):
    """Chunk de mensagem para streaming"""

    type: Literal["message", "structured_data", "progress", "complete"]
    content: str = ""
    data: dict[str, Any] | None = None


# === SCHEMAS PARA DADOS ESTRUTURADOS ===


class ImovelData(BaseModel):
    """Dados de um imóvel"""

    tipo: str = Field(..., description="Tipo do imóvel (apartamento, casa, etc.)")
    localizacao: str = Field(..., description="Localização do imóvel")
    valor_estimado: float | None = Field(None, description="Valor estimado em R$")
    valor_estimado_str: str | None = Field(None, description="Valor como string")
    status: str = Field(..., description="Status do imóvel (próprio, alugado, etc.)")
    renda_mensal: float | None = Field(None, description="Renda mensal em R$")
    renda_mensal_str: str | None = Field(None, description="Renda mensal como string")
    area: str | None = Field(None, description="Área do imóvel")
    data_aquisicao: str | None = Field(None, description="Data de aquisição")
    observacoes: str | None = Field(None, description="Observações adicionais")


class ParticipacaoSocietariaData(BaseModel):
    """Dados de participação societária"""

    empresa: str = Field(..., description="Nome da empresa")
    segmento: str = Field(..., description="Segmento de atuação")
    participacao: str = Field(..., description="Percentual de participação")
    faturamento_anual: str | None = Field(None, description="Faturamento anual")
    cnpj: str | None = Field(None, description="CNPJ da empresa")
    posicao: str | None = Field(None, description="Posição na empresa")
    data_criacao: str | None = Field(None, description="Data de criação/entrada")
    observacoes: str | None = Field(None, description="Observações adicionais")


class MembroFamiliaData(BaseModel):
    """Dados de membro da família"""

    nome: str = Field(..., description="Nome do membro")
    parentesco: str = Field(..., description="Grau de parentesco")
    idade: int | None = Field(None, description="Idade")
    ocupacao: str | None = Field(None, description="Ocupação/profissão")
    cpf: str | None = Field(None, description="CPF")
    observacoes: str | None = Field(None, description="Observações adicionais")


class EstruturaFamiliarData(BaseModel):
    """Dados da estrutura familiar"""

    estado_civil: str | None = Field(None, description="Estado civil")
    regime_bens: str | None = Field(None, description="Regime de bens")
    conjuge: MembroFamiliaData | None = Field(None, description="Dados do cônjuge")
    filhos: list[MembroFamiliaData] = Field(default_factory=list, description="Dados dos filhos")
    outros_dependentes: list[MembroFamiliaData] = Field(
        default_factory=list, description="Outros dependentes"
    )
    observacoes: str | None = Field(None, description="Observações adicionais")


class InvestimentoData(BaseModel):
    """Dados de investimento"""

    tipo: str = Field(..., description="Tipo de investimento")
    valor: float | None = Field(None, description="Valor em R$")
    valor_str: str | None = Field(None, description="Valor como string")
    detalhes: str | None = Field(None, description="Detalhes do investimento")
    instituicao: str | None = Field(None, description="Instituição financeira")
    data_aplicacao: str | None = Field(None, description="Data da aplicação")
    observacoes: str | None = Field(None, description="Observações adicionais")


class OutroAtivoData(BaseModel):
    """Dados de outros ativos"""

    tipo: str = Field(..., description="Tipo do ativo")
    descricao: str = Field(..., description="Descrição do ativo")
    valor: float | None = Field(None, description="Valor estimado em R$")
    valor_str: str | None = Field(None, description="Valor como string")
    observacoes: str | None = Field(None, description="Observações adicionais")


# === SCHEMA PRINCIPAL DOS DADOS ESTRUTURADOS ===


class ChatStructuredData(BaseModel):
    """Dados estruturados completos do chat"""

    imoveis: list[ImovelData] = Field(default_factory=list)
    participacoes: list[ParticipacaoSocietariaData] = Field(default_factory=list)
    estrutura_familiar: EstruturaFamiliarData | None = None
    investimentos: list[InvestimentoData] = Field(default_factory=list)
    outros_ativos: list[OutroAtivoData] = Field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        """Converte para dict para salvar no JSON"""
        return self.model_dump(exclude_none=True)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ChatStructuredData":
        """Cria instância a partir de dict do JSON"""
        return cls(**data)

    def get_progress(self) -> ChatProgressResponse:
        """Calcula o progresso da coleta de dados"""
        total_sections = 5
        completed_sections = 0
        missing_data = []

        # Verifica imóveis
        if self.imoveis:
            completed_sections += 1
        else:
            missing_data.append("Imóveis")

        # Verifica participações
        if self.participacoes:
            completed_sections += 1
        else:
            missing_data.append("Participações Societárias")

        # Verifica estrutura familiar
        if self.estrutura_familiar and (
            self.estrutura_familiar.estado_civil
            or self.estrutura_familiar.conjuge
            or self.estrutura_familiar.filhos
        ):
            completed_sections += 1
        else:
            missing_data.append("Estrutura Familiar")

        # Verifica investimentos
        if self.investimentos:
            completed_sections += 1
        else:
            missing_data.append("Investimentos")

        # Verifica outros ativos
        if self.outros_ativos:
            completed_sections += 1
        else:
            missing_data.append("Outros Ativos")

        percentage = int((completed_sections / total_sections) * 100)

        return ChatProgressResponse(
            completed_sections=completed_sections,
            total_sections=total_sections,
            percentage=percentage,
            missing_data=missing_data,
        )
