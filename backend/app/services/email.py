from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.security.jwt import JwtContext

jwt_context = JwtContext(
    key="asdf",
    algorithm="HSA256"
)

config = ConnectionConfig(
    MAIL_USERNAME="username",
    MAIL_PASSWORD="**********",
    MAIL_FROM="test@email.com",
    MAIL_PORT=465,
    MAIL_SERVER="mail server",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True)

html = """
<p>Чтобы подтвердить регистрацию на сайте, перейдите по ссылке: <a>{}</a><p> 
"""

mailer = FastMail(config)


async def send_email_verification(email: str):
    """Send an email from which user can register in the app."""
    
    token = jwt_context.encode({
        "exp": get_expire_time(30)
    })
    
    message = MessageSchema(
        subject="Fastapi-Mail module",
        recipients=[email],
        body=html.format(),
        subtype=MessageType.html)

    await mailer.send_message(message)
    

class EmailService:
    html_template = """
<p>Чтобы подтвердить регистрацию на сайте, перейдите по ссылке: <a>{}</a><p> 
"""
    
    async def send_verification_email(recipients):
        pass