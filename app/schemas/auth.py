from pydantic import BaseModel, EmailStr
import uuid

from models.admin_user import AdminRole, AdminStatus


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthTokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AdminUserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str | None = None
    role: AdminRole
    status: AdminStatus
    is_superuser: bool

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    tokens: AuthTokens
    user: AdminUserOut


class RefreshRequest(BaseModel):
    refresh_token: str


class RequestAccessRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    requested_role: AdminRole


class AccessDecision(BaseModel):
    approve: bool
    role_override: AdminRole | None = None  # superuser can grant a different role than requested