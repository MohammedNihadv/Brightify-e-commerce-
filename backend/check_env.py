import os
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

print(f"EMAIL_HOST_USER: {env('EMAIL_HOST_USER', default='NOT FOUND')}")
print(f"EMAIL_HOST_PASSWORD: {env('EMAIL_HOST_PASSWORD', default='NOT FOUND')[:10]}...")
print(f"DEFAULT_FROM_EMAIL: {env('DEFAULT_FROM_EMAIL', default='NOT FOUND')}")
