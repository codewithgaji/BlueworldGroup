"""
Seeds the four About pages (index, who-we-are, vision-mission, leadership)
with the copy that used to be hardcoded in the frontend route files,
translated into Page + PageBlock rows.

Usage:
    cd app
    python -m scripts.seed_pages          # skips any slug that already exists
    python -m scripts.seed_pages --reset  # wipes and recreates all four, every time

Run `alembic upgrade head` first — this script assumes the pages/page_blocks
tables already exist.
"""
import argparse

from db.session import SessionLocal
from models.page import Page, PageBlock, BlockType, PageStatus


def block(type_: BlockType, payload: dict, tone: str = "default") -> dict:
    """Just a readability helper — returns the kwargs for a PageBlock row minus `order`."""
    return {"type": type_, "tone": tone, "payload": payload}


PAGES: list[dict] = [
    {
        "slug": "about",
        "title": "A cosmetics house built in Lagos, for the world",
        "eyebrow": "About us",
        "description": (
            "Twenty-eight years of formulating, filling and shipping personal care from "
            "Nigeria — with the same rule on day one and today: make it properly or do not ship it."
        ),
        "hero_image": "about.story",
        "meta_title": "About Blue World Cosmetics — Our Story",
        "meta_description": (
            "Founded in Lagos in 1998, Blue World Cosmetics manufactures five personal-care "
            "brands reaching Nigeria, Kenya, China and India."
        ),
        "status": PageStatus.published,
        "blocks": [
            block(
                BlockType.prose_image,
                {
                    "eyebrow": "Our story",
                    "heading": "From two mixing vessels to five brands",
                    "description": (
                        "Blue World Cosmetics started in 1998 in a rented unit in Ikeja with "
                        "two mixing vessels, a hand-filling bench and one product: a glycerin "
                        "body lotion."
                    ),
                    "paragraphs": [
                        "What grew from there was not a single hero product but a house of "
                        "brands, each answering a different need on a Nigerian shelf: Vivon for "
                        "skincare, BlueCrystal for hygiene, Blow Right for hair, BlueFragrance "
                        "for scent, and the BlueWorld line for everyday essentials.",
                        "Today we operate two production lines, an in-house R&D laboratory and "
                        "a quality control unit that clears every batch against eleven separate "
                        "checks. We source shea and palm derivatives locally wherever the "
                        "specification allows, and we publish full ingredient decks on pack.",
                    ],
                    "image": "about.story",
                    "imageAlt": "Blue World R&D laboratory in Ikeja",
                    "imageSide": "left",
                },
            ),
            block(
                BlockType.globe_reach,
                {
                    "eyebrow": "Where we reach",
                    "heading": "Four countries on the manifest",
                    "description": (
                        "Hover or tap a marker to see the role each market plays. Nigeria is "
                        "home and manufacturing; Kenya is our East African distribution "
                        "beachhead; China and India cover ingredient sourcing, contract fill "
                        "and growing consumer volume."
                    ),
                },
                tone="muted",
            ),
            block(
                BlockType.link_cards,
                {
                    "eyebrow": "Go deeper",
                    "heading": "Explore the company",
                    "cards": [
                        {"label": "Who We Are", "href": "/about/who-we-are", "copy": "The plant, the people, the standards."},
                        {"label": "Vision & Mission", "href": "/about/vision-mission", "copy": "What we are building and why."},
                        {"label": "Leadership", "href": "/about/leadership", "copy": "The team accountable for it."},
                    ],
                },
            ),
        ],
    },
    {
        "slug": "about/who-we-are",
        "title": "Who we are",
        "eyebrow": "About us",
        "description": (
            "A vertically integrated Nigerian personal-care manufacturer: we formulate, "
            "produce, fill, pack and distribute under one roof."
        ),
        "hero_image": "hero.factory",
        "meta_title": "Who We Are — Blue World Cosmetics",
        "meta_description": (
            "Inside Blue World Cosmetics: two production lines, an in-house R&D lab and "
            "NAFDAC-certified quality control in Ikeja, Lagos."
        ),
        "status": PageStatus.published,
        "blocks": [
            block(
                BlockType.prose_image,
                {
                    "eyebrow": "The company",
                    "heading": "Everything happens in-house — on purpose",
                    "paragraphs": [
                        "Blue World Cosmetics Limited is a private Nigerian company incorporated "
                        "in 1998 and headquartered on Oba Akran Avenue, Ikeja Industrial Estate, "
                        "Lagos. We employ over two hundred people across manufacturing, "
                        "laboratory, commercial and field roles.",
                        "We chose vertical integration because the alternative — outsourcing "
                        "formulation to one party and filling to another — makes accountability "
                        "impossible. When a customer writes to us about a batch, we can put our "
                        "hands on the retained sample, the QC sheet and the chemist who signed it.",
                        "Our raw materials are sourced locally wherever a specification allows: "
                        "unrefined shea from the Middle Belt, palm derivatives from the "
                        "South-South, and imported actives only where no compliant local supply "
                        "exists.",
                    ],
                    "image": "hero.factory",
                    "imageAlt": "Production line at the Ikeja plant",
                    "imageSide": "right",
                },
            ),
            block(
                BlockType.card_grid,
                {
                    "eyebrow": "Capabilities",
                    "heading": "Four functions, one factory",
                    "columns": 2,
                    "cards": [
                        {
                            "title": "Manufacturing",
                            "body": "Two filling lines in Ikeja handling liquids, creams and solids, with a dedicated export packing floor for containerised shipments.",
                        },
                        {
                            "title": "Research & Development",
                            "body": "An in-house laboratory that owns every formula we sell. No white-label brief leaves the building without a tropical-stability result.",
                        },
                        {
                            "title": "Quality control",
                            "body": "Eleven checks per batch, retained samples for the full shelf life, and NAFDAC registration on every regulated SKU.",
                        },
                        {
                            "title": "Distribution",
                            "body": "A distributor network across all six Nigerian geopolitical zones, plus institutional supply to hospitals, schools and hospitality groups.",
                        },
                    ],
                },
                tone="muted",
            ),
        ],
    },
    {
        "slug": "about/vision-mission",
        "title": "Vision & mission",
        "eyebrow": "About us",
        "description": (
            "God Is Our Strength is not decoration on a logo — it is the standard we set "
            "before we had the equipment to meet it."
        ),
        "hero_image": "hero.beauty",
        "meta_title": "Vision & Mission — Blue World Cosmetics",
        "meta_description": (
            "Our vision, mission and the five values that govern how Blue World Cosmetics "
            "formulates, manufactures and trades."
        ),
        "status": PageStatus.published,
        "blocks": [
            block(
                BlockType.feature_pair,
                {
                    "items": [
                        {
                            "eyebrow": "Our vision",
                            "body": (
                                "To be the personal-care manufacturer that proves world-class "
                                "cosmetics can be formulated, produced and exported from Nigeria."
                            ),
                            "tone": "outline",
                        },
                        {
                            "eyebrow": "Our mission",
                            "body": (
                                "To make safe, effective and affordable skincare, hygiene, hair "
                                "and fragrance products for African families — manufactured "
                                "locally, documented fully, and priced fairly."
                            ),
                            "tone": "accent",
                        },
                    ],
                },
            ),
            block(
                BlockType.numbered_grid,
                {
                    "eyebrow": "Our values",
                    "heading": "Five rules we do not trade away",
                    "cards": [
                        {"title": "Formulate honestly", "body": "No banned actives, no undisclosed strengths, no marketing claim the laboratory cannot defend."},
                        {"title": "Price with respect", "body": "A Nigerian family should be able to buy the same quality every month, not only when the naira allows."},
                        {"title": "Buy Nigerian first", "body": "Local sourcing wherever specification allows, because a supply chain that stays close stays accountable."},
                        {"title": "Document everything", "body": "Retained samples, batch sheets and certificates of analysis. If it is not written down, it did not happen."},
                        {"title": "Grow our people", "body": "Chemists, operators and field staff trained internally and promoted from within wherever possible."},
                    ],
                },
                tone="muted",
            ),
        ],
    },
    {
        "slug": "about/leadership",
        "title": "Leadership",
        "eyebrow": "About us",
        "description": "A small executive team, each one accountable for a specific part of how the company runs.",
        "hero_image": None,
        "meta_title": "Leadership — Blue World Cosmetics",
        "meta_description": (
            "Meet the executive team running manufacturing, brands, R&D and commercial "
            "operations at Blue World Cosmetics."
        ),
        "status": PageStatus.published,
        "blocks": [
            block(
                BlockType.team_grid,
                {
                    "eyebrow": "Executive team",
                    "heading": "Who signs off on the work",
                },
            ),
        ],
    },
]


def seed(reset: bool) -> None:
    db = SessionLocal()
    try:
        for page_def in PAGES:
            slug = page_def["slug"]
            existing = db.query(Page).filter(Page.slug == slug).first()

            if existing and not reset:
                print(f"skip  '{slug}' — already exists (pass --reset to overwrite)")
                continue

            if existing and reset:
                db.delete(existing)
                db.flush()
                print(f"reset '{slug}' — deleted existing page and blocks")

            page = Page(
                slug=page_def["slug"],
                title=page_def["title"],
                eyebrow=page_def["eyebrow"],
                description=page_def["description"],
                hero_image=page_def["hero_image"],
                meta_title=page_def["meta_title"],
                meta_description=page_def["meta_description"],
                status=page_def["status"],
            )
            for i, b in enumerate(page_def["blocks"]):
                page.blocks.append(
                    PageBlock(type=b["type"], tone=b["tone"], order=i, payload=b["payload"])
                )
            db.add(page)
            db.commit()
            print(f"created '{slug}' with {len(page_def['blocks'])} block(s)")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--reset", action="store_true", help="delete and recreate pages that already exist")
    args = parser.parse_args()
    seed(reset=args.reset)