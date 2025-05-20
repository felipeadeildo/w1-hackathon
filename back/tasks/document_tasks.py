import uuid
from datetime import datetime

from sqlmodel import Session

from celery_app import celery_app
from core.database import engine
from models.holding.document import Document, DocumentExtractedData


@celery_app.task
def process_document_ocr_task(document_id: str) -> None:
    """Processa OCR de um documento em background."""
    with Session(engine) as session:
        doc = session.get(Document, uuid.UUID(document_id))
        if not doc:
            return
        doc.status = "processing"
        doc.ocr_processed = True
        doc.ocr_processed_at = datetime.utcnow()
        # Simulação de extração
        extracted_fields = {"nome": "Exemplo", "cpf": "000.000.000-00"}
        for field, value in extracted_fields.items():
            data = DocumentExtractedData(
                document_id=doc.id,
                field_name=field,
                field_value=value,
                confidence=0.99,
                extraction_method="ocr",
            )
            session.add(data)
        session.commit()
