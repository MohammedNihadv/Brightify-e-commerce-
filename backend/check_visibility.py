import boto3
import os
import requests

with open('.env', 'r') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            parts = line.strip().split('=', 1)
            if len(parts) == 2:
                os.environ[parts[0]] = parts[1]

s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    endpoint_url=os.environ.get('AWS_S3_ENDPOINT_URL'),
    region_name=os.environ.get('AWS_S3_REGION_NAME', 'us-east-1')
)

bucket_name = os.environ.get('AWS_STORAGE_BUCKET_NAME')
print(f"Checking bucket: {bucket_name}")

try:
    # Check if we can get bucket location or something simple
    res = s3.get_bucket_location(Bucket=bucket_name)
    print(f"Bucket Location: {res}")
except Exception as e:
    print(f"Error getting location: {e}")

# Try to get a specific file using boto3 (this uses S3 auth)
key = 'products/led-solar-lantern_mKgYmyQ.jpeg'
try:
    obj = s3.get_object(Bucket=bucket_name, Key=key)
    print(f"SUCCESS: Read {key} using S3 credentials. Size: {obj['ContentLength']}")
except Exception as e:
    print(f"FAILURE: Could not read {key} with S3 credentials: {e}")

# If we CAN read it with S3 credentials, but NOT with a public URL, it's definitely PRIVATE.
