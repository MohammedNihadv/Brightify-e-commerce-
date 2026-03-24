import os
import django
from urllib.parse import unquote

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Product
from store.serializers import ProductSerializer
from django.test import RequestFactory
from django.conf import settings

rf = RequestFactory()
request = rf.get('/')
products = Product.objects.all()
serializer = ProductSerializer(products, many=True, context={'request': request})

print(f"AWS_S3_CUSTOM_DOMAIN: {getattr(settings, 'AWS_S3_CUSTOM_DOMAIN', 'Not Set')}")
print(f"AWS_S3_ENDPOINT_URL: {getattr(settings, 'AWS_S3_ENDPOINT_URL', 'Not Set')}")
print("-" * 50)

for i, p in enumerate(products):
    serial_url = serializer.data[i]['image']
    db_path = str(p.image)
    print(f"Product: {p.name}")
    print(f"  DB Path: {db_path}")
    print(f"  Serial URL: {serial_url}")
    print(f"  Standard .url: {p.image.url if p.image else 'None'}")
    print("-" * 30)
