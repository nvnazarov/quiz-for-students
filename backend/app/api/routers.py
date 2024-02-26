from .users import router as users_router
from .groups import router as groups_router
from .quizzes import router as quizzes_router

all_routers = [
    users_router,
    groups_router,
    quizzes_router,
]