from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.deps import get_db, require_role
from models.admin_user import AdminRole
from models.submission import ContactSubmission, CareerApplication
from schemas.submission import ContactSubmissionOut, CareerApplicationOut

router = APIRouter(prefix="/admin/submissions", tags=["admin-submissions"])


@router.get("/contact", response_model=list[ContactSubmissionOut])
def list_contact_submissions(
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor, AdminRole.viewer)),
):
    return db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc()).all()


@router.get("/applications", response_model=list[CareerApplicationOut])
def list_applications(
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor, AdminRole.viewer)),
):
    return db.query(CareerApplication).order_by(CareerApplication.created_at.desc()).all()