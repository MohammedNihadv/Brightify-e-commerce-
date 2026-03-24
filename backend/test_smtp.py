import smtplib
import os
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

SMTP_SERVER = 'smtp-relay.brevo.com'

cases = [
    ('mhdnihadv@gmail.com', 'REDACTED_SMTP_KEY', 587, False, '587/TLS - Account Email + SMTP Key'),
    ('mhdnihadv@gmail.com', 'REDACTED_API_KEY', 587, False, '587/TLS - Account Email + API Key'),
    ('mhdnihadv@gmail.com', 'REDACTED_SMTP_KEY', 465, True, '465/SSL - Account Email + SMTP Key'),
    ('mhdnihadv@gmail.com', 'REDACTED_API_KEY', 465, True, '465/SSL - Account Email + API Key'),
]

for user, password, port, use_ssl, desc in cases:
    print(f"\n--- Testing Case: {desc} ---")
    try:
        if use_ssl:
            server = smtplib.SMTP_SSL(SMTP_SERVER, port, timeout=10)
        else:
            server = smtplib.SMTP(SMTP_SERVER, port, timeout=10)
            server.starttls()
            
        server.login(user, password)
        print(f"SUCCESS: {desc} worked!")
        server.quit()
        # If one works, we are happy
    except Exception as e:
        print(f"FAILURE for {desc}: {e}")
