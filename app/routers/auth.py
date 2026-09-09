from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from core.deps import get_db, get_current_user, require_role
from core.security import verify_password, hash_password, create_access_token, create_refresh_token, decode_token
from core import config
from models.admin_user import AdminUser, AdminRole, AdminStatus
from schemas.auth import (
    LoginRequest, LoginResponse, AuthTokens, AdminUserOut,
    RefreshRequest, RequestAccessRequest, AccessDecision,
)
from fastapi import Request 
from core.limiter import limiter 



router = APIRouter(prefix="/auth", tags=["auth"])
EXPIRES_IN = config.ACCESS_TOKEN_EXPIRE_MINUTES * 60


@router.post("/login", response_model=LoginResponse)
@limiter.limit("10/minute")  # Limit to 10 login attempts per minute
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account is inactive")
    return LoginResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        expires_in=EXPIRES_IN,
        user=AdminUserOut.model_validate(user),
    )


@router.post("/refresh", response_model=AuthTokens)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    decoded = decode_token(payload.refresh_token)
    if decoded is None or decoded.get("type") != "refresh":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid refresh token")
    user = db.query(AdminUser).filter(AdminUser.id == decoded.get("sub")).first()
    if not user or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return AuthTokens(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        expires_in=EXPIRES_IN,
    )


@router.get("/me", response_model=AdminUserOut)
def me(current_user: AdminUser = Depends(get_current_user)):
    return current_user


@router.post("/request-access", response_model=AdminUserOut, status_code=201)
@limiter.limit("3/hour")
def request_access(request: Request, payload: RequestAccessRequest, db: Session = Depends(get_db)):
    if payload.requested_role == AdminRole.admin:
        raise HTTPException(400, "Cannot request admin role directly")
    if db.query(AdminUser).filter(AdminUser.email == payload.email).first():
        raise HTTPException(409, "An account with this email already exists")
    user = AdminUser(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=payload.requested_role,
        status=AdminStatus.pending,
        is_superuser=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/access-requests", response_model=list[AdminUserOut])
def list_access_requests(
    db: Session = Depends(get_db),
    _: AdminUser = Depends(require_role(AdminRole.admin)),
):
    return db.query(AdminUser).filter(AdminUser.status == AdminStatus.pending).all()


@router.post("/access-requests/{user_id}/decision", response_model=AdminUserOut)
def decide_access_request(
    user_id: str,
    payload: AccessDecision,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(require_role(AdminRole.admin)),
):
    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if not user or user.status != AdminStatus.pending:
        raise HTTPException(404, "No pending request for this user")
    if payload.approve:
        user.status = AdminStatus.active
        if payload.role_override:
            user.role = payload.role_override
    else:
        user.status = AdminStatus.suspended
    db.commit()
    db.refresh(user)
    return user