import boto3
import os

# Manual env reading to avoid django dependence
with open('.env', 'r') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            os.environ[k] = v

s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    endpoint_url=os.environ.get('AWS_S3_ENDPOINT_URL'),
    region_name=os.environ.get('AWS_S3_REGION_NAME', 'us-east-1')
)

bucket_name = os.environ.get('AWS_STORAGE_BUCKET_NAME')

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
