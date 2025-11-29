from sib_api_v3_sdk import ApiClient, TransactionalEmailsApi, SendSmtpEmail
from app.config.config import brevo_config

def enviar_email(destinatario, assunto, html):
        api_client = ApiClient(brevo_config)
        api_instance = TransactionalEmailsApi(api_client)

        email = SendSmtpEmail(
            sender={'email': 'raulmb231@gmail.com'},
            to=[{'email': destinatario}],
            subject=assunto,
            html_content=html
        )

        try:
            api_instance.send_transac_email(email)
            return True
        except Exception:
            return False