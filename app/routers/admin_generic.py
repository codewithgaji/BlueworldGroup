import uuid
from typing import Type

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.deps import get_db, require_role
from models.admin_user import AdminRole


def make_admin_crud_router(
    resource: str,
    model,
    schema_out: Type[BaseModel],
    schema_create: Type[BaseModel],
) -> APIRouter:
    router = APIRouter(prefix=f"/admin/{resource}", tags=[f"admin-{resource}"])

    @router.get("", response_model=list[schema_out])
    def list_items(
        db: Session = Depends(get_db),
        _=Depends(require_role(AdminRole.admin, AdminRole.editor, AdminRole.viewer)),
    ):
        return db.query(model).all()

    @router.post("", response_model=schema_out, status_code=201)
    def create_item(
        payload: schema_create,
        db: Session = Depends(get_db),
        _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
    ):
        item = model(**payload.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @router.put("/{item_id}", response_model=schema_out)
    def update_item(
        item_id: uuid.UUID,
        payload: schema_create,
        db: Session = Depends(get_db),
        _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
    ):
        item = db.query(model).filter(model.id == item_id).first()
        if not item:
            raise HTTPException(404, f"{resource} not found")
        for field, value in payload.model_dump().items():
            setattr(item, field, value)
        db.commit()
        db.refresh(item)
        return item

    @router.delete("/{item_id}", status_code=204)
    def delete_item(
        item_id: uuid.UUID,
        db: Session = Depends(get_db),
        _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
    ):
        item = db.query(model).filter(model.id == item_id).first()
        if not item:
            raise HTTPException(404, f"{resource} not found")
        db.delete(item)
        db.commit()

    return router