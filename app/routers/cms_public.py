from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from core.deps import get_db
from models.hero_slide import HeroSlide
from models.business_unit import BusinessUnit
from models.product import Product
from models.team_member import TeamMember
from models.blog_post import BlogPost
from models.job_posting import JobPosting
from models.media_asset import MediaAsset
from models.site_settings import SiteSettings
from schemas.hero_slide import HeroSlideOut
from schemas.business_unit import BusinessUnitOut
from schemas.product import ProductOut
from schemas.team_member import TeamMemberOut
from schemas.blog_post import BlogPostOut
from schemas.job_posting import JobPostingOut
from schemas.media import MediaAssetOut
from schemas.settings import SiteSettingsOut

router = APIRouter(prefix="/cms", tags=["cms-public"])


@router.get("/hero-slides", response_model=list[HeroSlideOut])
def get_hero_slides(db: Session = Depends(get_db)):
    return db.query(HeroSlide).order_by(HeroSlide.order).all()


@router.get("/business-units", response_model=list[BusinessUnitOut])
def get_business_units(db: Session = Depends(get_db)):
    return db.query(BusinessUnit).options(joinedload(BusinessUnit.sub_lines)).order_by(BusinessUnit.order).all()


@router.get("/products", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@router.get("/team", response_model=list[TeamMemberOut])
def get_team(db: Session = Depends(get_db)):
    return db.query(TeamMember).order_by(TeamMember.order).all()


@router.get("/blog-posts", response_model=list[BlogPostOut])
def get_blog_posts(db: Session = Depends(get_db)):
    return db.query(BlogPost).order_by(BlogPost.published_at.desc()).all()


@router.get("/jobs", response_model=list[JobPostingOut])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(JobPosting).all()


@router.get("/media", response_model=list[MediaAssetOut])
def get_media(db: Session = Depends(get_db)):
    return db.query(MediaAsset).all()


@router.get("/settings", response_model=SiteSettingsOut)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings