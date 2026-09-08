from pydantic import BaseModel
import uuid


class HeroSlideBase(BaseModel):
    image_url: str
    title: str
    subtitle: str | None = None
    cta_text: str | None = None
    cta_link: str | None = None
    order: int = 0


class HeroSlideCreate(HeroSlideBase):
    pass


class HeroSlideOut(HeroSlideBase):
    id: uuid.UUID

    class Config:
        from_attributes = True