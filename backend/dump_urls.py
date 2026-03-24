import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
try:
    django.setup()
except Exception as e:
    print(f"Django setup failed: {e}")
    sys.exit(1)

from store.models import Product
from store.serializers import ProductSerializer
from django.test import RequestFactory
from django.conf import settings

rf = RequestFactory()
request = rf.get('/')
products = Product.objects.all()

log_file = 'image_url_debug.txt'
with open(log_file, 'w') as f:
    f.write(f"AWS_S3_ENDPOINT_URL: {settings.AWS_S3_ENDPOINT_URL}\n")
    f.write(f"AWS_S3_CUSTOM_DOMAIN: {getattr(settings, 'AWS_S3_CUSTOM_DOMAIN', 'None')}\n")
    f.write(f"AWS_STORAGE_BUCKET_NAME: {settings.AWS_STORAGE_BUCKET_NAME}\n")
    f.write("-" * 50 + "\n")
    
    for p in products:
        serializer = ProductSerializer(p, context={'request': request})
        serial_url = serializer.data['image']
        f.write(f"Product: {p.name}\n")
        f.write(f"  DB Path: {p.image.name if p.image else 'None'}\n")
        f.write(f"  Generated URL: {serial_url}\n")
        f.write("-" * 20 + "\n")

print(f"Debug info saved to {log_file}")
