import os
from db.session import SessionLocal
from models.admin_user import AdminUser, AdminRole, AdminStatus
from core.security import hash_password


def get_credentials():
    email = os.getenv("SUPERUSER_EMAIL") or input("Superuser email: ").strip()
    password = os.getenv("SUPERUSER_PASSWORD") or input("Superuser password: ").strip()
    full_name = os.getenv("SUPERUSER_FULL_NAME") or (input("Superuser full name (optional): ").strip() or None)
    return email, password, full_name


def main():
    db = SessionLocal()
    email, password, full_name = get_credentials()

    existing = db.query(AdminUser).filter(AdminUser.email == email).first()
    if existing:
        print(f"A user with email '{email}' already exists (status: {existing.status}, role: {existing.role}).")
        force = os.getenv("SUPERUSER_FORCE_PROMOTE", "").lower() == "true"
        confirm = "y" if force else input("Promote this existing user to superuser instead? [y/N]: ").strip().lower()
        if confirm == "y":
            existing.role = AdminRole.admin
            existing.status = AdminStatus.active
            existing.is_superuser = True
            db.commit()
            print(f"Promoted '{email}' to superuser.")
        else:
            print("No changes made.")
    else:
        superuser = AdminUser(
            email=email,
            hashed_password=hash_password(password),
            full_name=full_name,
            role=AdminRole.admin,
            status=AdminStatus.active,
            is_superuser=True,
        )
        db.add(superuser)
        db.commit()
        print(f"Superuser created: {email}")

    db.close()


if __name__ == "__main__":
    main()