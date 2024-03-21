from typing import Any

from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.dialects.postgresql import JSONB, BYTEA


class Base(DeclarativeBase):
    type_annotation_map = {
        dict[str, Any]: JSONB,
        bytes: BYTEA
    }