import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from orders.models import Order
from orders.serializers import OrderSerializer

try:
    order = Order.objects.get(id=28)
    serializer = OrderSerializer(order, many=False)
    data = serializer.data
    print("Order Items Images:")
    for item in data['order_items']:
        url = item['image']
        print(f"Item: {item['name']}")
        if 'X-Amz-Date=' in url:
            date = url.split('X-Amz-Date=')[1].split('&')[0]
            print(f"URL Date: {date}")
        else:
            print(f"Full URL: {url[:100]}...")
        print("-" * 20)
except Exception as e:
    print(f"Error: {e}")
