"""Fusion de mon historique et de celui de mon ami

Revision ID: 7a1e457d047b
Revises: 
Create Date: 2026-06-23 10:56:07.894047

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7a1e457d047b'
down_revision = ('53bd7c751128', 'd0a8b3e01563')  # <-- On lie les deux autres têtes ici
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
