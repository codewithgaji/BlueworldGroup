import uuid

from sqlalchemy import String, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from db.base import Base


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name: Mapped[str] = mapped_column(String, nullable=False, default="Blue World Cosmetics")
    tagline: Mapped[str] = mapped_column(String, nullable=True)
    address_lines: Mapped[list] = mapped_column(JSON, default=list)
    phones: Mapped[list] = mapped_column(JSON, default=list)
    emails: Mapped[list] = mapped_column(JSON, default=list)
    office_hours: Mapped[list] = mapped_column(JSON, default=list)
    map_embed_url: Mapped[str] = mapped_column(String, nullable=True)
    socials: Mapped[list] = mapped_column(JSON, default=list)
    footer_columns: Mapped[list] = mapped_column(JSON, default=list)