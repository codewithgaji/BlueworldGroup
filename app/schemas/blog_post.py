import uuid

from schemas.base import CamelModel


class BlogPostBase(CamelModel):
    slug: str
    title: str
    excerpt: str | None = None
    body: str | None = None
    category: str | None = None
    author: str | None = None
    published_at: str
    cover_image: str | None = None
    reading_minutes: int = 1


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostOut(BlogPostBase):
    id: uuid.UUID