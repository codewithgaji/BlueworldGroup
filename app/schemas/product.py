import uuid

from schemas.base import CamelModel
from models.business_unit import BusinessUnitSlug, BusinessSubLineSlug


class ProductBase(CamelModel):
    name: str
    unit: BusinessUnitSlug
    sub_line: BusinessSubLineSlug | None = None
    category: str
    description: str | None = None
    size: str | None = None
    image: str | None = None
    featured: bool = False


class ProductCreate(ProductBase):
    pass


class ProductOut(ProductBase):
    id: uuid.UUID