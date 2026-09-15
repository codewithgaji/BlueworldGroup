import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.deps import get_db, require_editor
from models.page import Page, PageBlock, PageStatus
from schemas.page import PageOut, PageCreate

public_router = APIRouter(prefix="/cms/pages", tags=["pages"])
admin_router = APIRouter(prefix="/admin/pages", tags=["admin:pages"])


@public_router.get("/{slug:path}", response_model=PageOut)
def get_page(slug: str, db: Session = Depends(get_db)):
    page = (
        db.query(Page)
        .filter(Page.slug == slug, Page.status == PageStatus.published)
        .first()
    )
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    return page


@admin_router.get("", response_model=list[PageOut])
def list_pages(db: Session = Depends(get_db), _=Depends(require_editor)):
    return db.query(Page).order_by(Page.slug).all()


@admin_router.get("/{page_id}", response_model=PageOut)
def get_admin_page(page_id: uuid.UUID, db: Session = Depends(get_db), _=Depends(require_editor)):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    return page


@admin_router.post("", response_model=PageOut, status_code=status.HTTP_201_CREATED)
def create_page(payload: PageCreate, db: Session = Depends(get_db), _=Depends(require_editor)):
    if db.query(Page).filter(Page.slug == payload.slug).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already in use")

    data = payload.model_dump(exclude={"blocks"})
    page = Page(**data)
    for i, block in enumerate(payload.blocks):
        page.blocks.append(
            PageBlock(
                type=block.type,
                tone=block.tone,
                order=i,
                payload=block.payload.model_dump(mode="json", by_alias=True),
            )
        )
    db.add(page)
    db.commit()
    db.refresh(page)
    return page


@admin_router.put("/{page_id}", response_model=PageOut)
def update_page(
    page_id: uuid.UUID,
    payload: PageCreate,
    db: Session = Depends(get_db),
    _=Depends(require_editor),
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")

    for field, value in payload.model_dump(exclude={"blocks"}).items():
        setattr(page, field, value)

    page.blocks.clear()  # cascade="all, delete-orphan" removes the old rows
    db.flush()
    for i, block in enumerate(payload.blocks):
        page.blocks.append(
            PageBlock(
                type=block.type,
                tone=block.tone,
                order=i,
                payload=block.payload.model_dump(mode="json", by_alias=True),
            )
        )
    db.commit()
    db.refresh(page)
    return page


@admin_router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_page(page_id: uuid.UUID, db: Session = Depends(get_db), _=Depends(require_editor)):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    db.delete(page)
    db.commit()