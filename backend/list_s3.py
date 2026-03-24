import boto3
import os
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

s3 = boto3.client(
    's3',
    aws_access_key_id=env('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=env('AWS_SECRET_ACCESS_KEY'),
    endpoint_url=env('AWS_S3_ENDPOINT_URL'),
    region_name=env('AWS_S3_REGION_NAME', default='us-east-1')
)

bucket_name = env('AWS_STORAGE_BUCKET_NAME')

print(f"Listing bucket: {bucket_name}")
try:
    response = s3.list_objects_v2(Bucket=bucket_name)
    if 'Contents' in response:
        for obj in response['Contents']:
            print(f" - {obj['Key']}")
    else:
        print("Bucket is empty or not accessible.")
except Exception as e:
    print(f"Error listing bucket: {e}")
