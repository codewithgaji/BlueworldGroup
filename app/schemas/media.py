import uuid

from schemas.base import CamelModel


class MediaAssetOut(CamelModel):
    id: uuid.UUID
    filename: str
    url: str
    local_path: str | None = None
    width: int = 0
    height: int = 0
    used_on: str | None = None