import uuid
from datetime import datetime

from pydantic import EmailStr

from models.admin_user import AdminRole, AdminStatus
from schemas.base import CamelModel


class LoginRequest(CamelModel):
    email: EmailStr
    password: str


class AdminUserOut(CamelModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str | None = None
    role: AdminRole
    status: AdminStatus
    is_superuser: bool
    created_at: datetime


class LoginResponse(CamelModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: AdminUserOut


class AuthTokens(CamelModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshRequest(CamelModel):
    refresh_token: str


class RequestAccessRequest(CamelModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    requested_role: AdminRole


class AccessDecision(CamelModel):
    approve: bool
    role_override: AdminRole | None = None