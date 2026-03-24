import os
import django
import random
from datetime import datetime, timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from store.models import Category, Product
from orders.models import Order, OrderItem, ShippingAddress

User = get_user_model()

def seed_db():
    print("Cleaning database...")
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    ShippingAddress.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    User.objects.filter(is_superuser=False).delete()

    print("Creating users...")
    users = []
    for i in range(1, 11):
        email = f'user{i}@example.com'
        user = User.objects.create_user(email, email, 'password123', first_name=f'User {i}')
        users.append(user)
    
    if not User.objects.filter(email='admin@admin.com').exists():
        User.objects.create_superuser('admin@admin.com', 'admin@admin.com', 'admin123', first_name='Admin')

    print("Creating categories...")
    categories_data = [
        {'name': 'Smart Lighting', 'slug': 'smart-lighting'},
        {'name': 'Home Lighting', 'slug': 'home-lighting'},
        {'name': 'Outdoor Lighting', 'slug': 'outdoor-lighting'},
        {'name': 'Eco Bulbs', 'slug': 'eco-bulbs'},
    ]
    categories = [Category.objects.create(**cat) for cat in categories_data]

    print("Creating products...")
    products = []
    for i in range(1, 31):
        cat = random.choice(categories)
        prod = Product.objects.create(
            name=f'{cat.name} Product {i}',
            slug=f'product-{i}',
            description=f'Description for product {i} in {cat.name} category.',
            price=random.randint(500, 5000),
            stock=random.randint(10, 100),
            category=cat,
            image=None
        )
        products.append(prod)

    print("Creating orders...")
    for i in range(1, 41):
        user = random.choice(users)
        
        # Create address
        addr = ShippingAddress.objects.create(
            user=user,
            address=f'{i} Main St',
            city='Mumbai',
            postal_code='400001',
            country='India',
            phone='9876543210',
            shipping_price=0
        )

        is_paid = random.choice([True, True, False]) # 66% chance paid
        is_delivered = is_paid and random.choice([True, False]) # only paid can be delivered
        
        # Random date in last 30 days
        created_at = timezone.now() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
        
        order = Order.objects.create(
            user=user,
            shipping_address=addr,
            payment_method='Razorpay',
            is_paid=is_paid,
            paid_at=created_at if is_paid else None,
            is_delivered=is_delivered,
            delivered_at=created_at + timedelta(days=2) if is_delivered else None,
            total_price=0 # will calculate
        )
        order.created_at = created_at
        order.save()

        # Add 1-3 items
        total = 0
        for _ in range(random.randint(1, 3)):
            prod = random.choice(products)
            qty = random.randint(1, 2)
            OrderItem.objects.create(
                order=order,
                product=prod,
                name=prod.name,
                qty=qty,
                price=prod.price
            )
            total += prod.price * qty
        
        order.total_price = total
        order.save()

    print("Successfully seeded database with expanded data!")

if __name__ == '__main__':
    seed_db()
