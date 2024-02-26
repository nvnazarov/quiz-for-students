from app.models import base
from app.db.db import engine

base.Base.metadata.create_all(engine)