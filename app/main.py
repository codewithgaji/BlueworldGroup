from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core import config
from routers import auth, cms_public, public_writes, admin_business_units, admin_media, admin_settings, admin_submissions, pages
from routers.admin_generic import make_admin_crud_router

from models.hero_slide import HeroSlide
from models.product import Product
from models.team_member import TeamMember
from models.blog_post import BlogPost
from models.job_posting import JobPosting

from schemas.hero_slide import HeroSlideOut, HeroSlideCreate
from schemas.product import ProductOut, ProductCreate
from schemas.team_member import TeamMemberOut, TeamMemberCreate
from schemas.blog_post import BlogPostOut, BlogPostCreate
from schemas.job_posting import JobPostingOut, JobPostingCreate

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from core.limiter import limiter


app = FastAPI(title="BlueWorld Cosmetics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(auth.router)
app.include_router(cms_public.router)
app.include_router(public_writes.router)
app.include_router(admin_business_units.router)
app.include_router(admin_media.router)
app.include_router(admin_settings.router)
app.include_router(admin_submissions.router)
app.include_router(pages.public_router)
app.include_router(pages.admin_router)

app.include_router(make_admin_crud_router("hero-slides", HeroSlide, HeroSlideOut, HeroSlideCreate))
app.include_router(make_admin_crud_router("products", Product, ProductOut, ProductCreate))
app.include_router(make_admin_crud_router("team", TeamMember, TeamMemberOut, TeamMemberCreate))
app.include_router(make_admin_crud_router("blog-posts", BlogPost, BlogPostOut, BlogPostCreate))
app.include_router(make_admin_crud_router("jobs", JobPosting, JobPostingOut, JobPostingCreate))


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Welcome to the BlueWorld Cosmetics API!"}