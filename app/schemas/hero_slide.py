import uuid

from schemas.base import CamelModel


class HeroSlideBase(CamelModel):
    image: str
    mobile_image: str | None = None
    video_url: str | None = None
    eyebrow: str | None = None
    title: str
    subtitle: str
    cta_label: str
    cta_href: str
    order: int = 0


class HeroSlideCreate(HeroSlideBase):
    pass


class HeroSlideOut(HeroSlideBase):
    id: uuid.UUID