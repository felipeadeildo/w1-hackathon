"""Make userprofile.cpf nullable

Revision ID: d0024e3b4cff
Revises: c3c1168eb6b6
Create Date: 2025-05-20 05:37:41.695140

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d0024e3b4cff"
down_revision: str | None = "c3c1168eb6b6"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create new table with updated schema
    op.create_table(
        "userprofile_new",
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("full_name", sa.String(), nullable=False),
        sa.Column("cpf", sa.String(), nullable=True),  # Now nullable
        sa.Column("rg", sa.String(), nullable=True),
        sa.Column("date_of_birth", sa.DateTime(), nullable=True),
        sa.Column("phone_number", sa.String(), nullable=True),
        sa.Column("address", sa.String(), nullable=True),
        sa.Column("marital_status", sa.String(), nullable=True),
        sa.Column("family_structure", sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"]),
        sa.PrimaryKeyConstraint("user_id"),
    )

    # Copy data from old table
    op.execute("INSERT INTO userprofile_new SELECT * FROM userprofile")

    # Drop old table and index
    op.drop_index("ix_userprofile_cpf", table_name="userprofile")
    op.drop_table("userprofile")

    # Rename new table to original name
    op.rename_table("userprofile_new", "userprofile")

    # Recreate index on new table
    op.create_index(op.f("ix_userprofile_cpf"), "userprofile", ["cpf"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Create temporary table with NOT NULL constraint
    op.create_table(
        "userprofile_new",
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("full_name", sa.String(), nullable=False),
        sa.Column("cpf", sa.String(), nullable=False),  # Back to NOT NULL
        sa.Column("rg", sa.String(), nullable=True),
        sa.Column("date_of_birth", sa.DateTime(), nullable=True),
        sa.Column("phone_number", sa.String(), nullable=True),
        sa.Column("address", sa.String(), nullable=True),
        sa.Column("marital_status", sa.String(), nullable=True),
        sa.Column("family_structure", sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"]),
        sa.PrimaryKeyConstraint("user_id"),
    )

    # Copy data (will fail if any NULL values exist)
    op.execute("INSERT INTO userprofile_new SELECT * FROM userprofile")

    # Drop old table and index
    op.drop_index("ix_userprofile_cpf", table_name="userprofile")
    op.drop_table("userprofile")

    # Rename new table to original name
    op.rename_table("userprofile_new", "userprofile")

    # Recreate index on new table
    op.create_index(op.f("ix_userprofile_cpf"), "userprofile", ["cpf"], unique=False)
