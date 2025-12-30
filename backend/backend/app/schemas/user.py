from dataclasses import dataclass


def require_fields(data: dict, fields: list[str]):
    missing = [f for f in fields if not data.get(f)]
    if missing:
        raise ValueError(f"Missing fields: {', '.join(missing)}")


def normalize_email(email: str) -> str:
    return email.strip().lower()


@dataclass
class ProfileUpdateInput:
    full_name: str
    email: str

    @classmethod
    def from_json(cls, data: dict):
        require_fields(data, ["fullName", "email"])
        return cls(full_name=data["fullName"].strip(), email=normalize_email(data["email"]))


@dataclass
class PasswordChangeInput:
    current_password: str
    new_password: str

    @classmethod
    def from_json(cls, data: dict):
        require_fields(data, ["currentPassword", "newPassword"])
        return cls(current_password=data["currentPassword"], new_password=data["newPassword"])
