from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.deps import get_db, require_role
from models.admin_user import AdminRole
from models.site_settings import SiteSettings
from schemas.settings import SiteSettingsOut, SiteSettingsUpdate

router = APIRouter(prefix="/admin/settings", tags=["admin-settings"])


@router.put("", response_model=SiteSettingsOut)
def update_settings(
    payload: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
):
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
    for field, value in payload.model_dump().items():
        setattr(settings, field, value)
    db.commit()
    db.refresh(settings)
    return settings