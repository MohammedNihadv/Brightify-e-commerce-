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
key = 'products/led-solar-lantern_mKgYmyQ.jpeg'

try:
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket_name, 'Key': key},
        ExpiresIn=3600
    )
    r = requests.get(url)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text}")
except Exception as e:
    print(f"Error: {e}")
