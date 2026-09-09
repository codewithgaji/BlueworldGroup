from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.deps import get_db
from models.submission import ContactSubmission, CareerApplication, NewsletterSignup
from schemas.submission import ContactSubmissionIn, CareerApplicationIn, NewsletterSignupIn

router = APIRouter(tags=["public-writes"])


@router.post("/contact")
def submit_contact(payload: ContactSubmissionIn, db: Session = Depends(get_db)):
    db.add(ContactSubmission(**payload.model_dump()))
    db.commit()
    return {"ok": True}


@router.post("/careers/apply")
def submit_application(payload: CareerApplicationIn, db: Session = Depends(get_db)):
    db.add(CareerApplication(**payload.model_dump()))
    db.commit()
    return {"ok": True}


@router.post("/newsletter/subscribe")
def subscribe_newsletter(payload: NewsletterSignupIn, db: Session = Depends(get_db)):
    if not db.query(NewsletterSignup).filter(NewsletterSignup.email == payload.email).first():
        db.add(NewsletterSignup(**payload.model_dump()))
        db.commit()
    return {"ok": True}