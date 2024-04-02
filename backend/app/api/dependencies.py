import os
from typing import Annotated
from datetime import timedelta

from fastapi import Header
from passlib.context import CryptContext

from app.services.user import UserService
from app.services.group import GroupService
from app.services.quiz import QuizService
from app.services.game import GameService
from app.repos.sql.user import SqlUserRepository
from app.repos.sql.group import SqlGroupRepository
from app.repos.sql.quiz import SqlQuizRepository
from app.security.jwt import JwtContext
from app.services.email import EmailService
from app.services.chat import ChatService
from app.repos.sql.chat import SqlChatRepository


_user_service = UserService(SqlUserRepository(),
                            JwtContext(key=os.getenv("QFS_USER_TOKEN_KEY"),
                                       algorithm=os.getenv("QFS_USER_TOKEN_ALGO"),
                                       expire=timedelta(minutes=int(os.getenv("QFS_USER_TOKEN_EXPIRE_MINUTES")))
                                       ),
                            CryptContext(schemes=["bcrypt"])
                            )

_group_service = GroupService(SqlGroupRepository(),
                              SqlUserRepository(),
                              JwtContext(key=os.getenv("QFS_GROUP_TOKEN_KEY"),
                                         algorithm=os.getenv("QFS_GROUP_TOKEN_ALGO"),
                                         expire=timedelta(minutes=int(os.getenv("QFS_GROUP_TOKEN_EXPIRE_MINUTES")))
                                         ),
                              )

_quiz_service = QuizService(SqlQuizRepository())

_game_service = GameService(SqlGroupRepository(),
                            SqlQuizRepository(),
                            SqlUserRepository())

_email_service = EmailService(JwtContext(key=os.getenv("QFS_EMAIL_TOKEN_KEY"),
                                         algorithm=os.getenv("QFS_EMAIL_TOKEN_ALGO"),
                                         ),
                              )

_chat_service = ChatService(SqlChatRepository(),
                            SqlGroupRepository(),
                            SqlUserRepository())


def get_user_service() -> UserService:
    return _user_service


def get_group_service() -> GroupService:
    return _group_service


def get_quiz_service() -> QuizService:
    return _quiz_service


def get_game_service() -> GameService:
    return _game_service


def get_email_service() -> EmailService: 
    return _email_service


def get_chat_service() -> ChatService:
    return _chat_service


def get_current_user_id(token: Annotated[str | None, Header()] = None) -> int:
    user_id = get_user_service().get_user_id_from_token(token)
    return user_id