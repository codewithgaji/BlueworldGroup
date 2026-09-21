"""add mobile_image_url to hero_slides

Revision ID: 45fda3fcd976
Revises: 54e7e849547f
Create Date: 2026-09-21 11:49:50.833104

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '45fda3fcd976'
down_revision: Union[str, None] = '54e7e849547f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('hero_slides', sa.Column('mobile_image', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('hero_slides', 'mobile_image')