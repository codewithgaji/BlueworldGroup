from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from core.deps import get_db
from models.hero_slide import HeroSlide
from models.business_unit import BusinessUnit
from schemas.hero_slide import HeroSlideOut
from schemas.business_unit import BusinessUnitOut

router = APIRouter(prefix="/cms", tags=["cms-public"])


@router.get("/hero-slides", response_model=list[HeroSlideOut])
def get_hero_slides(db: Session = Depends(get_db)):
    return db.query(HeroSlide).order_by(HeroSlide.order).all()


@router.get("/business-units", response_model=list[BusinessUnitOut])
def get_business_units(db: Session = Depends(get_db)):
    return (
        db.query(BusinessUnit)
        .options(joinedload(BusinessUnit.sub_lines))
        .all()
    )