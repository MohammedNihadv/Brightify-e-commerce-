import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Product

products = Product.objects.all()
updated = 0
for p in products:
    if not p.image:
        continue
        
    name = p.image.name
    # If the image is prefix with products/ but appears to be in the root based on user feedback/screenshot
    if name.startswith('products/'):
        print(f"Renaming {name} to {name.replace('products/', '', 1)}")
        p.image.name = name.replace('products/', '', 1)
        p.save()
        updated += 1

print(f"Successfully updated {updated} products.")
