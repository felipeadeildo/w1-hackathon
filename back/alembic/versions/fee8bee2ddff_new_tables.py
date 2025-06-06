"""new tables

Revision ID: fee8bee2ddff
Revises: d0024e3b4cff
Create Date: 2025-05-20 12:50:47.094016

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "fee8bee2ddff"
down_revision: str | None = "d0024e3b4cff"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "holding",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("estimated_completion_date", sa.DateTime(), nullable=True),
        sa.Column("estimated_total_assets_value", sa.Float(), nullable=True),
        sa.Column("estimated_annual_income", sa.Float(), nullable=True),
        sa.Column("client_id", sa.Uuid(), nullable=False),
        sa.Column("consultant_id", sa.Uuid(), nullable=True),
        sa.Column("cnpj", sa.String(), nullable=True),
        sa.Column("legal_name", sa.String(), nullable=True),
        sa.Column("incorporation_date", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["client_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["consultant_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_holding_status"), "holding", ["status"], unique=False)
    op.create_table(
        "holdingstage",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("holding_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("stage_type", sa.String(), nullable=False),
        sa.Column("start_date", sa.DateTime(), nullable=True),
        sa.Column("end_date", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["holding_id"],
            ["holding.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "simulationresult",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("holding_id", sa.Uuid(), nullable=False),
        sa.Column("created_by_user_id", sa.Uuid(), nullable=False),
        sa.Column("tax_savings_annual", sa.Float(), nullable=False),
        sa.Column("succession_savings_total", sa.Float(), nullable=False),
        sa.Column("total_savings_5y", sa.Float(), nullable=False),
        sa.Column("roi_percentage", sa.Float(), nullable=False),
        sa.Column("assumptions", sa.String(), nullable=True),
        sa.Column("simulation_period_years", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["created_by_user_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["holding_id"],
            ["holding.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "chatsession",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("stage_id", sa.Uuid(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("total_messages", sa.Integer(), nullable=False),
        sa.Column("client_satisfaction", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["stage_id"],
            ["holdingstage.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "asset",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("owner_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("asset_type", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("market_value", sa.Float(), nullable=False),
        sa.Column("acquisition_date", sa.DateTime(), nullable=True),
        sa.Column("acquisition_value", sa.Float(), nullable=True),
        sa.Column("identified_by", sa.String(), nullable=False),
        sa.Column("identified_in_chat_id", sa.Uuid(), nullable=True),
        sa.Column("real_estate_registry", sa.String(), nullable=True),
        sa.Column("real_estate_address", sa.String(), nullable=True),
        sa.Column("real_estate_area", sa.Float(), nullable=True),
        sa.Column("real_estate_tax_id", sa.String(), nullable=True),
        sa.Column("company_name", sa.String(), nullable=True),
        sa.Column("company_cnpj", sa.String(), nullable=True),
        sa.Column("company_participation_percentage", sa.Float(), nullable=True),
        sa.Column("investment_type", sa.String(), nullable=True),
        sa.Column("investment_institution", sa.String(), nullable=True),
        sa.Column("vehicle_make", sa.String(), nullable=True),
        sa.Column("vehicle_model", sa.String(), nullable=True),
        sa.Column("vehicle_year", sa.Integer(), nullable=True),
        sa.Column("vehicle_license_plate", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(
            ["identified_in_chat_id"],
            ["chatsession.id"],
        ),
        sa.ForeignKeyConstraint(
            ["owner_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "chatmessage",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("session_id", sa.Uuid(), nullable=False),
        sa.Column("sender", sa.String(), nullable=False),
        sa.Column("content", sa.String(), nullable=False),
        sa.Column("token_count", sa.Integer(), nullable=True),
        sa.Column("processed_duration_ms", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["session_id"],
            ["chatsession.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "chatdocumentgeneration",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("chat_session_id", sa.Uuid(), nullable=False),
        sa.Column("message_id", sa.Uuid(), nullable=False),
        sa.Column("holding_id", sa.Uuid(), nullable=False),
        sa.Column("target_stage_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(
            ["chat_session_id"],
            ["chatsession.id"],
        ),
        sa.ForeignKeyConstraint(
            ["holding_id"],
            ["holding.id"],
        ),
        sa.ForeignKeyConstraint(
            ["message_id"],
            ["chatmessage.id"],
        ),
        sa.ForeignKeyConstraint(
            ["target_stage_id"],
            ["holdingstage.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "holdingasset",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("holding_id", sa.Uuid(), nullable=False),
        sa.Column("asset_id", sa.Uuid(), nullable=False),
        sa.Column("integration_status", sa.String(), nullable=False),
        sa.Column("integration_date", sa.DateTime(), nullable=True),
        sa.Column("integration_value", sa.Float(), nullable=True),
        sa.Column("tax_paid", sa.Float(), nullable=True),
        sa.Column("annual_tax_before", sa.Float(), nullable=True),
        sa.Column("annual_tax_after", sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(
            ["asset_id"],
            ["asset.id"],
        ),
        sa.ForeignKeyConstraint(
            ["holding_id"],
            ["holding.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "taxsavingdetail",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("simulation_id", sa.Uuid(), nullable=False),
        sa.Column("saving_type", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("recurrence", sa.String(), nullable=False),
        sa.Column("applies_to_asset_id", sa.Uuid(), nullable=True),
        sa.Column("applies_to_family_member_id", sa.Uuid(), nullable=True),
        sa.ForeignKeyConstraint(
            ["applies_to_asset_id"],
            ["asset.id"],
        ),
        sa.ForeignKeyConstraint(
            ["applies_to_family_member_id"],
            ["familymember.id"],
        ),
        sa.ForeignKeyConstraint(
            ["simulation_id"],
            ["simulationresult.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "documentrequirement",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("holding_id", sa.Uuid(), nullable=False),
        sa.Column("stage_id", sa.Uuid(), nullable=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("doc_type", sa.String(), nullable=False),
        sa.Column("is_required", sa.Boolean(), nullable=False),
        sa.Column("created_by_user_id", sa.Uuid(), nullable=True),
        sa.Column("created_by_type", sa.String(), nullable=False),
        sa.Column("priority", sa.Integer(), nullable=False),
        sa.Column("reason", sa.String(), nullable=True),
        sa.Column("generated_from_chat_id", sa.Uuid(), nullable=True),
        sa.ForeignKeyConstraint(
            ["created_by_user_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["generated_from_chat_id"],
            ["chatdocumentgeneration.id"],
        ),
        sa.ForeignKeyConstraint(
            ["holding_id"],
            ["holding.id"],
        ),
        sa.ForeignKeyConstraint(
            ["stage_id"],
            ["holdingstage.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "document",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("holding_id", sa.Uuid(), nullable=False),
        sa.Column("requirement_id", sa.Uuid(), nullable=False),
        sa.Column("file_path", sa.String(), nullable=False),
        sa.Column("original_filename", sa.String(), nullable=False),
        sa.Column("file_type", sa.String(), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("content_type", sa.String(), nullable=False),
        sa.Column("uploaded_by_id", sa.Uuid(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("rejection_reason", sa.String(), nullable=True),
        sa.Column("validated_by_user_id", sa.Uuid(), nullable=True),
        sa.Column("validated_at", sa.DateTime(), nullable=True),
        sa.Column("ocr_processed", sa.Boolean(), nullable=False),
        sa.Column("ocr_confidence", sa.Float(), nullable=True),
        sa.Column("ocr_processed_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["holding_id"],
            ["holding.id"],
        ),
        sa.ForeignKeyConstraint(
            ["requirement_id"],
            ["documentrequirement.id"],
        ),
        sa.ForeignKeyConstraint(
            ["uploaded_by_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["validated_by_user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "documentextracteddata",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("document_id", sa.Uuid(), nullable=False),
        sa.Column("field_name", sa.String(), nullable=False),
        sa.Column("field_value", sa.String(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("extraction_method", sa.String(), nullable=False),
        sa.Column("verified", sa.Boolean(), nullable=False),
        sa.Column("verified_by_user_id", sa.Uuid(), nullable=True),
        sa.Column("verified_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["document_id"],
            ["document.id"],
        ),
        sa.ForeignKeyConstraint(
            ["verified_by_user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "documentreview",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("document_id", sa.Uuid(), nullable=False),
        sa.Column("reviewer_id", sa.Uuid(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("comments", sa.String(), nullable=True),
        sa.Column("correction_requested", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(
            ["document_id"],
            ["document.id"],
        ),
        sa.ForeignKeyConstraint(
            ["reviewer_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "holdingactivity",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("holding_id", sa.Uuid(), nullable=False),
        sa.Column("activity_type", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("performed_by_id", sa.Uuid(), nullable=True),
        sa.Column("performed_by_type", sa.String(), nullable=False),
        sa.Column("related_stage_id", sa.Uuid(), nullable=True),
        sa.Column("related_document_id", sa.Uuid(), nullable=True),
        sa.Column("related_chat_id", sa.Uuid(), nullable=True),
        sa.Column("time_spent_seconds", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["holding_id"],
            ["holding.id"],
        ),
        sa.ForeignKeyConstraint(
            ["performed_by_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["related_chat_id"],
            ["chatsession.id"],
        ),
        sa.ForeignKeyConstraint(
            ["related_document_id"],
            ["document.id"],
        ),
        sa.ForeignKeyConstraint(
            ["related_stage_id"],
            ["holdingstage.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.add_column("familymember", sa.Column("birth_date", sa.DateTime(), nullable=True))
    op.add_column("familymember", sa.Column("rg", sa.String(), nullable=True))
    op.add_column("familymember", sa.Column("is_dependent", sa.Boolean(), nullable=False))
    op.add_column("familymember", sa.Column("profession", sa.String(), nullable=True))
    op.add_column("familymember", sa.Column("income", sa.Float(), nullable=True))
    op.add_column("familymember", sa.Column("identified_by", sa.String(), nullable=False))
    op.add_column("familymember", sa.Column("identified_in_chat_id", sa.Uuid(), nullable=True))
    op.create_foreign_key(None, "familymember", "chatsession", ["identified_in_chat_id"], ["id"])
    op.drop_column("familymember", "date_of_birth")
    op.add_column("user", sa.Column("is_admin", sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("user", "is_admin")
    op.add_column(
        "familymember",
        sa.Column("date_of_birth", postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    )
    op.drop_constraint(None, "familymember", type_="foreignkey")
    op.drop_column("familymember", "identified_in_chat_id")
    op.drop_column("familymember", "identified_by")
    op.drop_column("familymember", "income")
    op.drop_column("familymember", "profession")
    op.drop_column("familymember", "is_dependent")
    op.drop_column("familymember", "rg")
    op.drop_column("familymember", "birth_date")
    op.drop_table("holdingactivity")
    op.drop_table("documentreview")
    op.drop_table("documentextracteddata")
    op.drop_table("document")
    op.drop_table("documentrequirement")
    op.drop_table("taxsavingdetail")
    op.drop_table("holdingasset")
    op.drop_table("chatdocumentgeneration")
    op.drop_table("chatmessage")
    op.drop_table("asset")
    op.drop_table("chatsession")
    op.drop_table("simulationresult")
    op.drop_table("holdingstage")
    op.drop_index(op.f("ix_holding_status"), table_name="holding")
    op.drop_table("holding")
    # ### end Alembic commands ###
