import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Product

products = Product.objects.all()
print(f"{'ID':<5} | {'Name':<30} | {'Image Field'}")
print("-" * 80)
for p in products:
    print(f"{p.id:<5} | {p.name[:30]:<30} | {p.image}")
