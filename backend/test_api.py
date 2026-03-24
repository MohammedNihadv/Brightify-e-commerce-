import requests
import json
import os
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Using the API Key from the case the user provided
api_key = 'REDACTED_API_KEY'

url = "https://api.brevo.com/v3/smtp/email"

payload = {
    "sender": {"name": "Brightify Support", "email": "Brightify.support@gmail.com"},
    "to": [{"email": "mhdnihadv@gmail.com", "name": "Admin Test"}],
    "subject": "API Connectivity Test",
    "htmlContent": "<html><body><h1>It works!</h1><p>Brevo API is working correctly.</p></body></html>"
}

headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "api-key": api_key
}

print(f"Testing Brevo API with key: {api_key[:10]}...")
try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code in [201, 202]:
        print("SUCCESS: API is working!")
    else:
        print("FAILURE: API returned an error.")
except Exception as e:
    print(f"FAILURE: {e}")
