"""initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.Text, unique=True, nullable=False),
        sa.Column("name", sa.Text),
        sa.Column("picture", sa.Text),
        sa.Column("level_estimate", sa.String(10)),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "practice_results",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("skill", sa.Text, nullable=False),
        sa.Column("type", sa.Text),
        sa.Column("score", sa.Integer),
        sa.Column("feedback", JSONB),
        sa.Column("transcript", sa.Text),
        sa.Column("prompt_text", sa.Text),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "flashcards",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("word", sa.Text, nullable=False),
        sa.Column("translation", sa.Text, nullable=False),
        sa.Column("example_sentence", sa.Text),
        sa.Column("synonyms", sa.Text),
        sa.Column("difficulty", sa.Integer, default=1),
        sa.Column("next_review", sa.DateTime),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("flashcards")
    op.drop_table("practice_results")
    op.drop_table("users")
