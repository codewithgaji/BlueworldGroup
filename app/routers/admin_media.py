import io
import uuid

import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from PIL import Image
from sqlalchemy.orm import Session

from core.deps import get_db, require_role
from core import config
from models.admin_user import AdminRole
from models.media_asset import MediaAsset
from schemas.media import MediaAssetOut, MediaAssetUpdate, MediaAssetCreate

cloudinary.config(
    cloud_name=config.CLOUDINARY_CLOUD_NAME,
    api_key=config.CLOUDINARY_API_KEY,
    api_secret=config.CLOUDINARY_API_SECRET,
)

router = APIRouter(prefix="/admin/media", tags=["admin-media"])

MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # Cloudinary's plan limit
MAX_DIMENSION = 2400  # longest edge, in pixels — plenty sharp for web use


def compress_image(raw: bytes) -> tuple[bytes, str]:
    """
    Resizes and re-encodes an image so it comfortably clears Cloudinary's
    upload size limit, without a visible quality loss for web display.
    Returns (compressed_bytes, content_type).
    """
    img = Image.open(io.BytesIO(raw))
    has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)

    # Shrink only if it's actually larger than our target — never upscale.
    if max(img.size) > MAX_DIMENSION:
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

    buffer = io.BytesIO()
    if has_alpha:
        img = img.convert("RGBA")
        img.save(buffer, format="PNG", optimize=True)
        content_type = "image/png"
    else:
        img = img.convert("RGB")
        # Step the JPEG quality down only as far as needed to clear the limit —
        # starts high (92) so most images need no further reduction at all.
        quality = 92
        while True:
            buffer.seek(0)
            buffer.truncate()
            img.save(buffer, format="JPEG", quality=quality, optimize=True)
            if buffer.tell() <= MAX_UPLOAD_BYTES or quality <= 40:
                break
            quality -= 8
        content_type = "image/jpeg"

    return buffer.getvalue(), content_type


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
    raw = file.file.read()
    try:
        compressed, _content_type = compress_image(raw)
    except Exception:
        raise HTTPException(400, "Could not process this image — please upload a valid JPEG, PNG or WebP file.")

    if len(compressed) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            413,
            "This image is too large even after compression. Please upload a smaller photo.",
        )

    result = cloudinary.uploader.upload(
        io.BytesIO(compressed),
        folder=config.CLOUDINARY_UPLOAD_FOLDER,
    )
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


@router.put("/{asset_id}", response_model=MediaAssetOut)
def update_media(
    asset_id: uuid.UUID,
    payload: MediaAssetUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
):
    asset = db.query(MediaAsset).filter(MediaAsset.id == asset_id).first()
    if not asset:
        raise HTTPException(404, "Media asset not found")
    if payload.filename is not None:
        asset.filename = payload.filename
    if payload.used_on is not None:
        asset.used_on = payload.used_on
    db.commit()
    db.refresh(asset)
    return asset

@router.delete("/{asset_id}", status_code=204)
def delete_media(
    asset_id: uuid.UUID,
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
):
    asset = db.query(MediaAsset).filter(MediaAsset.id == asset_id).first()
    if not asset:
        raise HTTPException(404, "Media asset not found")
    db.delete(asset)
    db.commit()




@router.post("", response_model=MediaAssetOut, status_code=201)
def register_existing_media(
    payload: MediaAssetCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role(AdminRole.admin, AdminRole.editor)),
):
    """
    Registers an image that already exists at a URL (e.g. still on Cloudinary
    after its database row was deleted) — no re-upload, just a new tracking
    record. Does not verify the URL is reachable or actually an image.
    """
    asset = MediaAsset(
        filename=payload.filename or payload.url.rsplit("/", 1)[-1],
        url=payload.url,
        width=payload.width,
        height=payload.height,
        used_on=payload.used_on or "",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset