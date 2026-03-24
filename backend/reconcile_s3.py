import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Product
import boto3

# List actual S3 keys again to be sure
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

response = s3.list_objects_v2(Bucket=bucket_name)
actual_keys = [obj['Key'] for obj in response.get('Contents', [])]

print("Actual S3 Keys:")
for k in actual_keys:
    print(f" - {k}")

products = Product.objects.all()
updated = 0

for p in products:
    if not p.image: continue
    
    current_path = p.image.name
    # Don't touch full URLs
    if current_path.startswith('http'): continue
    
    filename = os.path.basename(current_path)
    
    # Check if filename exists in root OR products/ folder in S3
    found_key = None
    if current_path in actual_keys:
        found_key = current_path
    elif f"products/{filename}" in actual_keys:
        found_key = f"products/{filename}"
    elif filename in actual_keys:
        found_key = filename
    elif filename.replace('.jpeg', '.jpg') in actual_keys:
        found_key = filename.replace('.jpeg', '.jpg')
    elif filename.replace('.jpg', '.jpeg') in actual_keys:
        found_key = filename.replace('.jpg', '.jpeg')
        
    if found_key and found_key != current_path:
        print(f"Updating {p.name}: {current_path} -> {found_key}")
        p.image.name = found_key
        p.save()
        updated += 1
    elif not found_key:
        print(f"WARNING: No S3 key found for {p.name} (current: {current_path})")

print(f"Updated {updated} product paths.")
