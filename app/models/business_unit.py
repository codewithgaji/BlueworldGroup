import uuid
import enum
from datetime import datetime, timezone

from sqlalchemy import String, Text, Enum as SAEnum, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from db.base import Base


class BusinessUnitSlug(str, enum.Enum):
    vivon = "vivon"
    bluecrystal = "bluecrystal"
    blow_right = "blow-right"
    bluefragrance = "bluefragrance"
    blueworld_cosmetics = "blueworld-cosmetics"


class BusinessSubLineSlug(str, enum.Enum):
    face = "face"
    body = "body"
    children = "children"


class BusinessUnit(Base):
    __tablename__ = "business_units"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[BusinessUnitSlug] = mapped_column(SAEnum(BusinessUnitSlug), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    tagline: Mapped[str] = mapped_column(String, nullable=True)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    hero_image: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    sub_lines: Mapped[list["BusinessSubLine"]] = relationship(
        back_populates="business_unit", cascade="all, delete-orphan"
    )


class BusinessSubLine(Base):
    __tablename__ = "business_sub_lines"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_unit_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("business_units.id"), nullable=False
    )
    slug: Mapped[BusinessSubLineSlug] = mapped_column(SAEnum(BusinessSubLineSlug), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    hero_image: Mapped[str] = mapped_column(String, nullable=True)

    business_unit: Mapped["BusinessUnit"] = relationship(back_populates="sub_lines")