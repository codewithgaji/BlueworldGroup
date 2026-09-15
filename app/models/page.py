import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


class BlockType(str, enum.Enum):
    prose = "prose"
    prose_image = "prose_image"
    card_grid = "card_grid"
    numbered_grid = "numbered_grid"
    feature_pair = "feature_pair"
    link_cards = "link_cards"
    team_grid = "team_grid"
    globe_reach = "globe_reach"


class PageStatus(str, enum.Enum):
    draft = "draft"
    published = "published"


class Page(Base):
    __tablename__ = "pages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    eyebrow: Mapped[str | None] = mapped_column(String, nullable=True)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    hero_image: Mapped[str | None] = mapped_column(String, nullable=True)
    meta_title: Mapped[str | None] = mapped_column(String, nullable=True)
    meta_description: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[PageStatus] = mapped_column(
        SAEnum(PageStatus, name="page_status"), default=PageStatus.draft, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    blocks: Mapped[list["PageBlock"]] = relationship(
        back_populates="page",
        cascade="all, delete-orphan",
        order_by="PageBlock.order",
        lazy="selectin",
    )


class PageBlock(Base):
    __tablename__ = "page_blocks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pages.id", ondelete="CASCADE"), nullable=False, index=True
    )
    type: Mapped[BlockType] = mapped_column(SAEnum(BlockType, name="block_type"), nullable=False)
    tone: Mapped[str] = mapped_column(String, default="default", nullable=False)  # default | muted
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    payload: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    page: Mapped["Page"] = relationship(back_populates="blocks")