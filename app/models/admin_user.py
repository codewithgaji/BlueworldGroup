import uuid
import enum
from datetime import datetime, timezone

from sqlalchemy import String, Enum as SAEnum, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from db.base import Base


class AdminRole(str, enum.Enum):
    admin = "admin"
    editor = "editor"
    viewer = "viewer"


class AdminStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    suspended = "suspended"


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    full_name: Mapped[str] = mapped_column(String, nullable=True)
    role: Mapped[AdminRole] = mapped_column(
        SAEnum(AdminRole), default=AdminRole.viewer, nullable=False
    )
    status: Mapped[AdminStatus] = mapped_column(
        SAEnum(AdminStatus), default=AdminStatus.pending, nullable=False
    )
    is_superuser: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    @property
    def is_active(self) -> bool:
        return self.status == AdminStatus.active