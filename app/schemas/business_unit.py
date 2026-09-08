from pydantic import BaseModel
import uuid

from models.business_unit import BusinessUnitSlug, BusinessSubLineSlug


class BusinessSubLineOut(BaseModel):
    id: uuid.UUID
    slug: BusinessSubLineSlug
    name: str
    summary: str | None = None
    hero_image: str | None = None

    class Config:
        from_attributes = True


class BusinessUnitBase(BaseModel):
    slug: BusinessUnitSlug
    name: str
    tagline: str | None = None
    summary: str | None = None
    hero_image: str | None = None


class BusinessUnitCreate(BusinessUnitBase):
    pass


class BusinessUnitOut(BusinessUnitBase):
    id: uuid.UUID
    sub_lines: list[BusinessSubLineOut] = []

    class Config:
        from_attributes = True