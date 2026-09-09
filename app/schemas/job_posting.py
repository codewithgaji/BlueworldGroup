import uuid

from schemas.base import CamelModel
from models.job_posting import EmploymentType


class JobPostingBase(CamelModel):
    slug: str
    title: str
    department: str | None = None
    location: str | None = None
    employment_type: EmploymentType
    summary: str | None = None
    responsibilities: list[str] = []
    requirements: list[str] = []
    posted_at: str
    closes_at: str | None = None


class JobPostingCreate(JobPostingBase):
    pass


class JobPostingOut(JobPostingBase):
    id: uuid.UUID