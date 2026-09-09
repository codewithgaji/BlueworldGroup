import uuid

from schemas.base import CamelModel
from models.business_unit import BusinessUnitSlug, BusinessSubLineSlug


class BusinessSubLineBase(CamelModel):
    slug: BusinessSubLineSlug
    name: str
    tagline: str | None = None
    description: str | None = None
    hero_image: str | None = None


class BusinessSubLineCreate(BusinessSubLineBase):
    pass


class BusinessSubLineOut(BusinessSubLineBase):
    id: uuid.UUID


class BusinessUnitBase(CamelModel):
    slug: BusinessUnitSlug
    name: str
    tagline: str | None = None
    summary: str | None = None
    story: str | None = None
    hero_image: str | None = None
    accent: str = "blue"
    order: int = 0


class BusinessUnitCreate(BusinessUnitBase):
    sub_lines: list[BusinessSubLineCreate] = []


class BusinessUnitOut(BusinessUnitBase):
    id: uuid.UUID
    sub_lines: list[BusinessSubLineOut] = []