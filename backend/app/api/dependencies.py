import os
from typing import Annotated

from fastapi import Header, HTTPException, status
from passlib.context import CryptContext

from app.services.users import UserService
from app.services.group import GroupService
from app.services.quiz import QuizService
from app.services.game import GameService
from app.repos.sql.user import SqlUserRepository
from app.repos.sql.group import SqlGroupRepository
from app.repos.sql.quiz import SqlQuizRepository
from app.security.jwt import JwtContext


_user_service = UserService(SqlUserRepository(),
                            JwtContext(key=os.getenv("QFS_USER_TOKEN_KEY"),
                                       algorithm=os.getenv("QFS_USER_TOKEN_ALGO")),
                            CryptContext(schemes=["bcrypt"]))

_group_service = GroupService(SqlGroupRepository(),
                              JwtContext(key=os.getenv("QFS_GROUP_TOKEN_KEY"),
                                         algorithm=os.getenv("QFS_GROUP_TOKEN_ALGO")))

_quiz_service = QuizService(SqlQuizRepository())


_game_service = GameService(SqlGroupRepository(), SqlQuizRepository())


def get_user_service() -> UserService:
    return _user_service


def get_group_service() -> GroupService:
    return _group_service


def get_quiz_service() -> QuizService:
    return _quiz_service


def get_game_service() -> GameService:
    return _game_service


def get_current_user_id(token: Annotated[str | None, Header()] = None) -> int:
    user_id = get_user_service().get_user_id_from_token(token)
    return user_id