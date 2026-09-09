import uuid
from datetime import datetime

from schemas.base import CamelModel


class ContactSubmissionIn(CamelModel):
    full_name: str
    email: str
    subject: str | None = None
    message: str


class ContactSubmissionOut(ContactSubmissionIn):
    id: uuid.UUID
    created_at: datetime


class CareerApplicationIn(CamelModel):
    job_slug: str
    full_name: str
    email: str
    phone: str | None = None
    cover_message: str | None = None


class CareerApplicationOut(CareerApplicationIn):
    id: uuid.UUID
    created_at: datetime


class NewsletterSignupIn(CamelModel):
    email: str