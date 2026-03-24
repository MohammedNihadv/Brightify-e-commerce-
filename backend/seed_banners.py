import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Banner

def seed_banners():
    banners = [
        {
            'title': 'Illuminate Your Premium Space',
            'subtitle': 'Discover designer lighting that transforms your home into a masterpiece of light and shadow.',
            'image': 'banner1.png',
            'order': 1,
            'link': '/shop'
        },
        {
            'title': 'Smart Lighting, Smarter Living',
            'subtitle': 'Control your ambiance with your voice or a simple tap. Experience the future of home automation.',
            'image': 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop',
            'order': 2,
            'link': '/category/smart-lighting'
        },
        {
            'title': 'Luxury Outdoor Elegance',
            'subtitle': 'Extend your living room to the night sky. Premium weather-proof lighting for the modern villa.',
            'image': 'https://images.unsplash.com/photo-1571217694042-32a26c483256?q=80&w=2070&auto=format&fit=crop',
            'order': 3,
            'link': '/category/outdoor-lighting'
        }
    ]

    print("Cleaning old banners...")
    Banner.objects.all().delete()

    for b_data in banners:
        Banner.objects.create(**b_data)
        print(f"Created banner: {b_data['title']}")

if __name__ == '__main__':
    seed_banners()
