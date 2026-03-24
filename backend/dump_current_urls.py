import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Product
from store.serializers import ProductSerializer
from django.test import RequestFactory

rf = RequestFactory()
request = rf.get('/')
products = Product.objects.all()

print(f"{'ID':<36} | {'Name':<30} | {'Generated URL'}")
print("-" * 100)
for p in products:
    serializer = ProductSerializer(p, context={'request': request})
    url = serializer.data['image']
    print(f"{str(p.id):<36} | {p.name[:30]:<30} | {url}")
