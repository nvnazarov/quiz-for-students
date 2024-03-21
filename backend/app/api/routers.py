from app.api.user import router as user_router
from app.api.group import router as group_router
from app.api.quiz import router as quiz_router

all_routers = [
    user_router,
    group_router,
    quiz_router,
]