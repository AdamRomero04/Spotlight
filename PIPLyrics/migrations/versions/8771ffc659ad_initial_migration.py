"""Initial migration

Revision ID: 8771ffc659ad
Revises: 
Create Date: 2023-07-24 13:51:42.017714

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8771ffc659ad'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('song',
    sa.Column('trackID', sa.String(length=22), nullable=False),
    sa.Column('trackColor', sa.String(length=10), nullable=False),
    sa.PrimaryKeyConstraint('trackID')
    )
    op.create_table('lyric',
    sa.Column('words', sa.Text(), nullable=False),
    sa.Column('startTime', sa.Integer(), nullable=True),
    sa.Column('song_id', sa.String(length=22), nullable=True),
    sa.Column('uniqueID', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['song_id'], ['song.trackID'], ),
    sa.PrimaryKeyConstraint('uniqueID')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('lyric')
    op.drop_table('song')
    # ### end Alembic commands ###