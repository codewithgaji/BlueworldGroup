from schemas.base import CamelModel


class SocialLink(CamelModel):
    label: str
    href: str


class FooterLink(CamelModel):
    label: str
    href: str


class FooterColumn(CamelModel):
    title: str
    links: list[FooterLink] = []


class SiteSettingsOut(CamelModel):
    company_name: str
    tagline: str | None = None
    address_lines: list[str] = []
    phones: list[str] = []
    emails: list[str] = []
    office_hours: list[str] = []
    map_embed_url: str | None = None
    socials: list[SocialLink] = []
    footer_columns: list[FooterColumn] = []


class SiteSettingsUpdate(SiteSettingsOut):
    pass