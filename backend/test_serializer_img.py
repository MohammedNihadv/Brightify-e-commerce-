import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Product
from store.serializers import ProductSerializer

def test_serializer():
    p_names = ['Metal Stone', 'ULTRAMAX']
    results = {}
    for name in p_names:
        p = Product.objects.filter(name__icontains=name).first()
        if p:
            serializer = ProductSerializer(p)
            results[name] = serializer.data['image']
        else:
            results[name] = "Product not found"
    
    output_path = r'c:\Users\mhdni\Desktop\e-commerce\backend\serializer_results.txt'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(json.dumps(results, indent=2))
    print(f"Done writing to {output_path}")
