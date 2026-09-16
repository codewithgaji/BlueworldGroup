import uuid
from typing import Literal, Annotated, Union, Any

from pydantic import Field, model_validator

from schemas.base import CamelModel
from models.page import BlockType, PageStatus


class CardItem(CamelModel):
    title: str
    body: str


class LinkCardItem(CamelModel):
    label: str
    href: str
    copy: str


class FeatureItem(CamelModel):
    eyebrow: str
    body: str
    tone: str = "outline"  # outline | accent


class ProsePayload(CamelModel):
    type: Literal[BlockType.prose] = BlockType.prose
    eyebrow: str | None = None
    heading: str | None = None
    paragraphs: list[str] = []


class ProseImagePayload(CamelModel):
    type: Literal[BlockType.prose_image] = BlockType.prose_image
    eyebrow: str | None = None
    heading: str
    description: str | None = None
    paragraphs: list[str] = []
    image: str
    image_alt: str = ""
    image_side: Literal["left", "right"] = "left"


class CardGridPayload(CamelModel):
    type: Literal[BlockType.card_grid] = BlockType.card_grid
    eyebrow: str | None = None
    heading: str | None = None
    columns: Literal[2, 3, 4] = 2
    cards: list[CardItem] = []


class NumberedGridPayload(CamelModel):
    type: Literal[BlockType.numbered_grid] = BlockType.numbered_grid
    eyebrow: str | None = None
    heading: str | None = None
    cards: list[CardItem] = []


class FeaturePairPayload(CamelModel):
    type: Literal[BlockType.feature_pair] = BlockType.feature_pair
    items: list[FeatureItem] = []


class LinkCardsPayload(CamelModel):
    type: Literal[BlockType.link_cards] = BlockType.link_cards
    eyebrow: str | None = None
    heading: str | None = None
    cards: list[LinkCardItem] = []


class TeamGridPayload(CamelModel):
    type: Literal[BlockType.team_grid] = BlockType.team_grid
    eyebrow: str | None = None
    heading: str | None = None
    limit: int | None = None


class GlobeReachPayload(CamelModel):
    type: Literal[BlockType.globe_reach] = BlockType.globe_reach
    eyebrow: str | None = None
    heading: str | None = None
    description: str | None = None


BlockPayload = Annotated[
    Union[
        ProsePayload,
        ProseImagePayload,
        CardGridPayload,
        NumberedGridPayload,
        FeaturePairPayload,
        LinkCardsPayload,
        TeamGridPayload,
        GlobeReachPayload,
    ],
    Field(discriminator="type"),
]


def _get(source: Any, key: str, default: Any = None) -> Any:
    """Reads `key` off either a plain dict or a SQLAlchemy ORM object."""
    if isinstance(source, dict):
        return source.get(key, default)
    return getattr(source, key, default)


class PageBlockIn(CamelModel):
    type: BlockType
    tone: Literal["default", "muted"] = "default"
    order: int = 0
    payload: BlockPayload

    @model_validator(mode="before")
    @classmethod
    def _bridge_type_into_payload(cls, data: Any) -> Any:
        """
        `type` is stored once, as PageBlock's own column — never duplicated
        inside the JSON payload itself (the seed script and the frontend admin
        editor both store payloads without it). Since `payload` is a
        discriminated union keyed on an inner `type` field, we inject the
        sibling `type` into the payload dict here, before validation, so
        neither direction (reading from the DB, or writing from the API) has
        to remember to embed it manually.
        Handles both a plain dict (incoming JSON body) and a SQLAlchemy
        PageBlock ORM instance (outgoing response).
        """
        block_type = _get(data, "type")
        payload = _get(data, "payload")
        if block_type is None or payload is None:
            return data

        if isinstance(payload, dict) and "type" not in payload:
            payload = {**payload, "type": block_type}

        return {
            "id": _get(data, "id"),
            "type": block_type,
            "tone": _get(data, "tone", "default"),
            "order": _get(data, "order", 0),
            "payload": payload,
        }


class PageBlockOut(PageBlockIn):
    id: uuid.UUID


class PageBase(CamelModel):
    slug: str
    title: str
    eyebrow: str | None = None
    description: str | None = None
    hero_image: str | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    status: PageStatus = PageStatus.draft


class PageCreate(PageBase):
    blocks: list[PageBlockIn] = []


class PageOut(PageBase):
    id: uuid.UUID
    blocks: list[PageBlockOut] = []