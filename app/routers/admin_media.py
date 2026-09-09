import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from core.deps import get_db, require_role
from core import config
from models.admin_user import AdminRole
from models.media_asset import MediaAsset
from schemas.media import MediaAssetOut

cloudinary.config(
    cloud_name=config.CLOUDINARY_CLOUD_NAME,
    api_key=config.CLOUDINARY_API_KEY,
    api_secret=config.CLOUDINARY_API_SECRET,
)

router = APIRouter(prefix="/admin/media", tags=["admin-media"])


@router.get("", response_model=list[MediaAssetOut])
def list_media(
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor, AdminRole.viewer)),
):
    return db.query(MediaAsset).all()


@router.post("/upload", response_model=MediaAssetOut, status_code=201)
def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
):
    result = cloudinary.uploader.upload(file.file, folder=config.CLOUDINARY_UPLOAD_FOLDER)
    asset = MediaAsset(
        filename=file.filename,
        url=result["secure_url"],
        width=result.get("width", 0),
        height=result.get("height", 0),
        used_on="",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset