"""Agregar campo strava a la tabla User

Revision ID: 56acf350b786
Revises: 
Create Date: 2021-10-07 12:00:00

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '56acf350b786'
branch_labels = None
depends_on = None
down_revision = 'd520c4bb54c7'



def upgrade():
    # Agrega el campo strava a la tabla User
    op.add_column('user', sa.Column('strava', sa.Boolean, nullable=True))


def downgrade():
    # Revierte la adición del campo created_at
    op.drop_column('user', 'strava')
