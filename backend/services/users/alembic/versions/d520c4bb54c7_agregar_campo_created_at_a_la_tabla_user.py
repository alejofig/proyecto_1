"""Agregar campo created_at a la tabla User

Revision ID: d520c4bb54c7
Revises: 
Create Date: <fecha de creación>

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd520c4bb54c7'
branch_labels = None
depends_on = None
down_revision = None


def upgrade():
    # Agrega el campo created_at a la tabla User
    op.add_column('user', sa.Column('created_at', sa.DateTime(), nullable=True))


def downgrade():
    # Revierte la adición del campo created_at
    op.drop_column('user', 'created_at')
