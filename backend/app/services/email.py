import smtplib
from smtplib import SMTPRecipientsRefused
import os
from email.message import EmailMessage

from fastapi import HTTPException, status

from app.security.token import TokenContext


class EmailService:
    _html_template = """
    <p>
    Чтобы подтвердить регистрацию на сайте, перейдите по
    <a href='http://localhost:3000/activate/{}'>ссылке</a>.
    <p> 
    """

    _token_context: TokenContext = None
    _USERNAME = os.getenv("QFS_EMAIL_USERNAME")
    _PASSWORD = os.getenv("QFS_EMAIL_PASSWORD")


    def __init__(self, token_context: TokenContext):
        self._token_context = token_context

    
    async def get_user_id_from_token(self, token: str) -> int:
        try:
            payload = self._token_context.decode(token)
            id = int(payload["sub"])
        except:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Token is invalid")
        return id


    async def send_verification_email(self, user_id, email):
        token = self._token_context.encode({
            "sub": str(user_id),
        })
        
        try:
            em = EmailMessage()
            em["subject"] = "Quiz-for-Students"
            em["from"] = self._USERNAME
            em["to"] = email
            em.set_content(self._html_template.format(token),
                            subtype="html"
                            )
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(self._USERNAME, self._PASSWORD)
                server.send_message(em)
        except SMTPRecipientsRefused:
            pass