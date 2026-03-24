import boto3
import os
import requests
from botocore.config import Config

with open('.env', 'r') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            parts = line.strip().split('=', 1)
            if len(parts) == 2:
                os.environ[parts[0]] = parts[1]

# Supabase S3 often prefers explicit s3v4 and specific region handling
s3_config = Config(
    region_name='ap-southeast-2',
    signature_version='s3v4',
)

s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    endpoint_url=os.environ.get('AWS_S3_ENDPOINT_URL'),
    config=s3_config
)

bucket_name = os.environ.get('AWS_STORAGE_BUCKET_NAME')
key = 'products/led-solar-lantern_mKgYmyQ.jpeg'

print(f"Testing presigned URL with ap-southeast-2 and s3v4...")
try:
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket_name, 'Key': key},
        ExpiresIn=3600
    )
    r = requests.get(url)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print("SUCCESS! Presigned URL works.")
    else:
        print(f"Response: {r.text}")
except Exception as e:
    print(f"Error: {e}")
