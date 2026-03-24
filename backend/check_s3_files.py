import os
import environ
import boto3
from botocore.exceptions import ClientError

# Setup env
env = environ.Env()
environ.Env.read_env('.env')

s3 = boto3.client(
    's3',
    aws_access_key_id=env('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=env('AWS_SECRET_ACCESS_KEY'),
    endpoint_url=env('AWS_S3_ENDPOINT_URL'),
    region_name=env('AWS_S3_REGION_NAME', default='ap-southeast-2')
)

bucket = env('AWS_STORAGE_BUCKET_NAME')
files_to_check = [
    'products/iBbqF9Hu.jpeg',
    'products/led-solar-lantern_mKgYmyQ.jpeg'
]

print(f"Checking bucket: {bucket}")
for key in files_to_check:
    try:
        s3.head_object(Bucket=bucket, Key=key)
        print(f"EXISTS: {key}")
    except ClientError as e:
        if e.response['Error']['Code'] == "404":
            print(f"MISSING: {key}")
        else:
            print(f"ERROR: {key} - {e}")
