import os
from db.session import SessionLocal
from models.admin_user import AdminUser, AdminRole, AdminStatus
from core.security import hash_password


def get_credentials():
    email = os.getenv("SUPERUSER_EMAIL") or input("Superuser email: ").strip()
    password = os.getenv("SUPERUSER_PASSWORD") or input("Superuser password: ").strip()
    full_name = os.getenv("SUPERUSER_FULL_NAME") or (input("Superuser full name (optional): ").strip() or None)
    return email, password, full_name


def seed_superuser(db=None, email=None, password=None, full_name=None, interactive=True):
    """
    Idempotent superuser seed. Safe to call on every app startup.
    - If a superuser already exists anywhere in the table, does nothing (no prompt).
    - Only creates/promotes when explicitly given credentials (env vars) or run interactively.
    """
    owns_session = db is None
    if owns_session:
        db = SessionLocal()

    try:
        # Skip entirely if any superuser already exists — this is what makes it safe on every boot
        existing_superuser = db.query(AdminUser).filter(AdminUser.is_superuser == True).first()
        if existing_superuser:
            print(f"Superuser already exists ({existing_superuser.email}) — skipping seed.")
            return

        # Need credentials to create one. On non-interactive startup, only proceed if env vars are set.
        if email is None or password is None:
            if not interactive:
                if os.getenv("SUPERUSER_EMAIL") and os.getenv("SUPERUSER_PASSWORD"):
                    email = os.getenv("SUPERUSER_EMAIL")
                    password = os.getenv("SUPERUSER_PASSWORD")
                    full_name = os.getenv("SUPERUSER_FULL_NAME")
                else:
                    print("No superuser exists and SUPERUSER_EMAIL/SUPERUSER_PASSWORD not set — skipping auto-seed.")
                    return
            else:
                email, password, full_name = get_credentials()

        existing = db.query(AdminUser).filter(AdminUser.email == email).first()
        if existing:
            print(f"A user with email '{email}' already exists (status: {existing.status}, role: {existing.role}).")
            force = os.getenv("SUPERUSER_FORCE_PROMOTE", "").lower() == "true"
            confirm = "y" if force else (
                input("Promote this existing user to superuser instead? [y/N]: ").strip().lower()
                if interactive else "n"
            )
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
    finally:
        if owns_session:
            db.close()


def main():
    seed_superuser(interactive=True)


if __name__ == "__main__":
    main()