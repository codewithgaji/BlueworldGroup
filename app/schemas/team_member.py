import uuid

from schemas.base import CamelModel


class TeamMemberBase(CamelModel):
    name: str
    role: str
    bio: str | None = None
    photo: str | None = None
    order: int = 0


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberOut(TeamMemberBase):
    id: uuid.UUID