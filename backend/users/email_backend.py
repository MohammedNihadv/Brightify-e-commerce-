import requests
import logging
from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings

logger = logging.getLogger(__name__)

class BrevoApiBackend(BaseEmailBackend):
    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        msg_count = 0
        for message in email_messages:
            if self._send(message):
                msg_count += 1
        return msg_count

    def _send(self, message):
        api_key = getattr(settings, 'EMAIL_HOST_PASSWORD', None)
        if not api_key:
            logger.error("Brevo API Key not found in EMAIL_HOST_PASSWORD")
            return False

        url = "https://api.brevo.com/v3/smtp/email"
        
        # Parse from email
        from_email = message.from_email or getattr(settings, 'DEFAULT_FROM_EMAIL', '')
        
        # Robust extraction for "Name <email>" or just "email"
        if "<" in from_email and ">" in from_email:
            name_part, email_part = from_email.split("<")
            sender = {
                "name": name_part.strip(),
                "email": email_part.split(">")[0].strip()
            }
        else:
            sender = {
                "name": "Brightify",
                "email": from_email.strip()
            }

        # Prepare content
        html_content = None
        if message.content_subtype == 'html':
            html_content = message.body
        
        # Check for alternatives (EmailMultiAlternatives)
        if hasattr(message, 'alternatives'):
            for alt_content, alt_mimetype in message.alternatives:
                if alt_mimetype == 'text/html':
                    html_content = alt_content
                    break
        
        if not html_content:
            html_content = f"<html><body>{message.body.replace('\\n', '<br>')}</body></html>"

        payload = {
            "sender": sender,
            "to": [{"email": recipient} for recipient in message.to],
            "subject": message.subject,
            "htmlContent": html_content
        }

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": api_key
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            if response.status_code in [201, 202]:
                return True
            else:
                logger.error(f"Brevo API error: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"Brevo API exception: {str(e)}")
            return False
