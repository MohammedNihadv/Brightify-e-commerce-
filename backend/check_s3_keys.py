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

keys_to_check = [
    '30w-max-power-rechargeable-led-bulb_C8fWk4j.jpeg',
    'products/30w-max-power-rechargeable-led-bulb_C8fWk4j.jpeg',
    '30w-max-power-rechargeable-led-bulb.jpeg',
    'products/30w-max-power-rechargeable-led-bulb.jpeg',
    'led-solar-lantern_mKgYmyQ.jpeg',
    'products/led-solar-lantern_mKgYmyQ.jpeg'
]

for key in keys_to_check:
    try:
        s3.head_object(Bucket=bucket_name, Key=key)
        print(f"EXISTS: {key}")
    except:
        print(f"MISSING: {key}")

print("-" * 30)
response = s3.list_objects_v2(Bucket=bucket_name)
if 'Contents' in response:
    for obj in response['Contents']:
        print(f"BUCKET_KEY: {obj['Key']}")
else:
    print("BUCKET IS EMPTY")
