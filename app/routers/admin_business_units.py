import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from core.deps import get_db, require_role
from models.admin_user import AdminRole
from models.business_unit import BusinessUnit, BusinessSubLine
from schemas.business_unit import BusinessUnitOut, BusinessUnitCreate

router = APIRouter(prefix="/admin/business-units", tags=["admin-business-units"])


@router.get("", response_model=list[BusinessUnitOut])
def list_business_units(
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor, AdminRole.viewer)),
):
    return db.query(BusinessUnit).options(joinedload(BusinessUnit.sub_lines)).all()


@router.post("", response_model=BusinessUnitOut, status_code=201)
def create_business_unit(
    payload: BusinessUnitCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
):
    unit = BusinessUnit(**payload.model_dump(exclude={"sub_lines"}))
    for sl in payload.sub_lines:
        unit.sub_lines.append(BusinessSubLine(**sl.model_dump()))
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return unit


@router.put("/{unit_id}", response_model=BusinessUnitOut)
def update_business_unit(
    unit_id: uuid.UUID,
    payload: BusinessUnitCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
):
    unit = db.query(BusinessUnit).filter(BusinessUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(404, "Business unit not found")
    for field, value in payload.model_dump(exclude={"sub_lines"}).items():
        setattr(unit, field, value)
    unit.sub_lines.clear()
    for sl in payload.sub_lines:
        unit.sub_lines.append(BusinessSubLine(**sl.model_dump()))
    db.commit()
    db.refresh(unit)
    return unit


@router.delete("/{unit_id}", status_code=204)
def delete_business_unit(
    unit_id: uuid.UUID,
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
):
    unit = db.query(BusinessUnit).filter(BusinessUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(404, "Business unit not found")
    db.delete(unit)
    db.commit()