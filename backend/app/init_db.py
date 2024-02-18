from app.models import models
from app.services.db import engine

models.Base.metadata.create_all(engine)