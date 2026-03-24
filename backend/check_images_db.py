import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Product

with open('images_list.txt', 'w', encoding='utf-8') as f:
    f.write("ID | Name | Image Path\n")
    f.write("-" * 50 + "\n")
    for p in Product.objects.all():
        img_name = p.image.name if p.image else "No Image"
        f.write(f"{p.id} | {p.name} | {img_name}\n")
print("Done writing to images_list.txt")
