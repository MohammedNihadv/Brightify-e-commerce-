import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from orders.models import Order
from orders.serializers import OrderSerializer

def test_order_serialization():
    last_order = Order.objects.last()
    with open('test_order_out_utf8.txt', 'w', encoding='utf-8') as f:
        if last_order:
            data = OrderSerializer(last_order).data
            f.write(f"Last Order ID: {data['id']}\n")
            for item in data.get('order_items', []):
                f.write(f"Item: {item['name']}\n")
                f.write(f"Image API output: {item['image']}\n")
        else:
            f.write("No orders found.\n")

if __name__ == '__main__':
    test_order_serialization()
