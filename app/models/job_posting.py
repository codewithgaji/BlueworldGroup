import uuid
import enum

from sqlalchemy import String, Text, Enum as SAEnum, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from db.base import Base


class EmploymentType(str, enum.Enum):
    full_time = "Full-time"
    contract = "Contract"
    internship = "Internship"


class JobPosting(Base):
    __tablename__ = "job_postings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    department: Mapped[str] = mapped_column(String, nullable=True)
    location: Mapped[str] = mapped_column(String, nullable=True)
    employment_type: Mapped[EmploymentType] = mapped_column(SAEnum(EmploymentType), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    responsibilities: Mapped[list] = mapped_column(JSON, default=list)
    requirements: Mapped[list] = mapped_column(JSON, default=list)
    posted_at: Mapped[str] = mapped_column(String, nullable=True)
    closes_at: Mapped[str | None] = mapped_column(String, nullable=True)