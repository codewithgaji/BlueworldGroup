import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from db.base import Base
from models.business_unit import BusinessUnitSlug, BusinessSubLineSlug


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    unit: Mapped[BusinessUnitSlug] = mapped_column(SAEnum(BusinessUnitSlug), nullable=False)
    sub_line: Mapped[BusinessSubLineSlug | None] = mapped_column(SAEnum(BusinessSubLineSlug), nullable=True)
    category: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    size: Mapped[str] = mapped_column(String, nullable=True)
    image: Mapped[str] = mapped_column(String, nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )