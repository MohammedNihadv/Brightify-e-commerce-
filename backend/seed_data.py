import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from store.models import Category, Product

User = get_user_model()

def seed_db():
    print("Creating superuser...")
    if not User.objects.filter(username='admin@admin.com').exists():
        User.objects.create_superuser('admin@admin.com', 'admin@admin.com', 'admin123', first_name='Admin')

    print("Creating test user...")
    if not User.objects.filter(username='user@user.com').exists():
        User.objects.create_user('user@user.com', 'user@user.com', 'user123', first_name='Test User')

    print("Cleaning database...")
    Product.objects.all().delete()
    Category.objects.all().delete()

    print("Creating lighting categories...")
    home_light, _ = Category.objects.get_or_create(name='Home Lighting', slug='home-lighting')
    out_light, _ = Category.objects.get_or_create(name='Outdoor Lighting', slug='outdoor-lighting')
    smart_light, _ = Category.objects.get_or_create(name='Smart Lighting', slug='smart-lighting')
    energy_bulb, _ = Category.objects.get_or_create(name='Energy-Saving Bulbs', slug='energy-saving-bulbs')

    products = [
        # --- Energy Saving Bulbs ---
        {'name': 'Premium 12W LED Bulb', 'slug': 'premium-12w-led-bulb', 'description': 'Energy-efficient 12W LED bulb providing bright, warm white light for your living spaces. Lifespan of up to 25,000 hours.', 'price': 499.00, 'stock': 150, 'category': energy_bulb, 'image': 'https://picsum.photos/seed/light1/800/600'},
        {'name': 'Emergency Inverter Bulb', 'slug': 'emergency-inverter-bulb', 'description': 'Never sit in the dark again. This 9W LED bulb automatically turns on during power outages and lasts up to 4 hours.', 'price': 1199.00, 'stock': 40, 'category': energy_bulb, 'image': 'https://picsum.photos/seed/light3/800/600'},
        {'name': 'E27 15W Daylight LED Bulb', 'slug': 'e27-15w-daylight', 'description': 'Super bright daylight LED bulb for offices and study areas. 15W power for maximum visibility and productivity.', 'price': 599.00, 'stock': 200, 'category': energy_bulb, 'image': 'https://picsum.photos/seed/light9/800/600'},
        {'name': 'Dimmable Vintage Edison Bulb', 'slug': 'dimmable-vintage-edison', 'description': 'Energy-saving LED technology with a classic vintage look. Fully dimmable to create the perfect cozy atmosphere.', 'price': 799.00, 'stock': 120, 'category': energy_bulb, 'image': 'https://picsum.photos/seed/light10/800/600'},
        {'name': 'Candle Shape Chandelier Bulb', 'slug': 'candle-shape-chandelier', 'description': 'Elegant 5W LED candle bulb perfect for chandeliers and decorative fixtures. Warm white glow.', 'price': 399.00, 'stock': 300, 'category': energy_bulb, 'image': 'https://picsum.photos/seed/light11/800/600'},
        {'name': 'High Lumen Corn Bulb', 'slug': 'high-lumen-corn-bulb', 'description': 'Ultra-bright 30W corn LED bulb for large spaces, garages, and warehouses. 360-degree illumination.', 'price': 1699.00, 'stock': 85, 'category': energy_bulb, 'image': 'https://picsum.photos/seed/light12/800/600'},
        {'name': 'GU10 LED Spotlight Bulb', 'slug': 'gu10-led-spotlight', 'description': 'Perfect for track lighting and recessed fixtures. 7W directional light with excellent color rendering.', 'price': 499.00, 'stock': 180, 'category': energy_bulb, 'image': 'https://picsum.photos/seed/light13/800/600'},
        {'name': 'Color Changing Refrigerator Bulb', 'slug': 'color-changing-fridge-bulb', 'description': 'Small, compact LED bulb suitable for appliances like refrigerators and microwaves. Long lasting.', 'price': 299.00, 'stock': 400, 'category': energy_bulb, 'image': 'https://picsum.photos/seed/light14/800/600'},
        
        # --- Smart Lighting ---
        {'name': 'Smart WiFi Color LED Bulb', 'slug': 'smart-wifi-color-led', 'description': 'Control your lighting with your voice. Millions of colors, dimmable, and compatible with Alexa and Google Home.', 'price': 1699.00, 'stock': 85, 'category': smart_light, 'image': 'https://picsum.photos/seed/light2/800/600'},
        {'name': 'Smart LED Strip Lights (16.4ft)', 'slug': 'smart-led-strip-lights', 'description': 'Flexible RGB LED strip lights with music sync and app control. Perfect for bedroom decor behind TVs and monitors.', 'price': 2199.00, 'stock': 110, 'category': smart_light, 'image': 'https://picsum.photos/seed/light15/800/600'},
        {'name': 'Smart Light Bar System', 'slug': 'smart-light-bar-system', 'description': 'Dual light bars that sync with your PC or TV for an immersive gaming and viewing experience. Razer Chroma compatible.', 'price': 5099.00, 'stock': 45, 'category': smart_light, 'image': 'https://picsum.photos/seed/light16/800/600'},
        {'name': 'Smart Dimmer Switch', 'slug': 'smart-dimmer-switch', 'description': 'Upgrade your existing lights. Control from anywhere, set schedules, and use voice commands without needing smart bulbs.', 'price': 2999.00, 'stock': 70, 'category': smart_light, 'image': 'https://picsum.photos/seed/light17/800/600'},
        {'name': 'Motion Sensor Smart Bulb', 'slug': 'motion-sensor-smart', 'description': 'Turns on automatically when motion is detected and turns off after 30 seconds. Perfect for hallways and closets.', 'price': 1399.00, 'stock': 90, 'category': smart_light, 'image': 'https://picsum.photos/seed/light18/800/600'},
        {'name': 'Smart Ceiling Light Panel', 'slug': 'smart-ceiling-panel', 'description': 'Ultra-thin modern smart panel. Adjust color temperature from cool white to warm white via the companion app.', 'price': 6799.00, 'stock': 35, 'category': smart_light, 'image': 'https://picsum.photos/seed/light19/800/600'},
        {'name': 'Smart Filament Globe Bulb', 'slug': 'smart-filament-globe', 'description': 'Combines vintage aesthetics with modern smart tech. Ask Google or Alexa to set the perfect mood lighting.', 'price': 1999.00, 'stock': 60, 'category': smart_light, 'image': 'https://picsum.photos/seed/light20/800/600'},
        {'name': 'Smart Outdoor String Lights', 'slug': 'smart-outdoor-string', 'description': 'Weatherproof smart string lights. Change individual bulb colors for holidays or parties directly from your phone.', 'price': 7699.00, 'stock': 25, 'category': smart_light, 'image': 'https://picsum.photos/seed/light21/800/600'},

        # --- Home Lighting ---
        {'name': 'Modern Minimalist Ceiling Light', 'slug': 'modern-minimalist-ceiling', 'description': 'Sleek, flush-mount LED ceiling light perfect for modern bedrooms, kitchens, and hallways. Provides excellent ambient lighting.', 'price': 7699.00, 'stock': 25, 'category': home_light, 'image': 'https://picsum.photos/seed/light4/800/600'},
        {'name': 'Vintage Filament Wall Sconce', 'slug': 'vintage-filament-wall-sconce', 'description': 'Add a touch of retro charm to your walls. Industrial-style wall lighting fixture featuring a warm Edison-style filament.', 'price': 3999.00, 'stock': 30, 'category': home_light, 'image': 'https://picsum.photos/seed/light5/800/600'},
        {'name': 'Crystal Chandelier Lighting', 'slug': 'crystal-chandelier', 'description': 'A stunning centerpiece for your dining room. Premium K9 crystals paired with a modern gold finish for ultimate luxury.', 'price': 33999.00, 'stock': 5, 'category': home_light, 'image': 'https://picsum.photos/seed/light8/800/600'},
        {'name': 'Nordic Wood Pendant Light', 'slug': 'nordic-wood-pendant', 'description': 'Minimalist pendant light featuring ash wood and matte aluminum. Perfect for hanging over kitchen islands or dining tables.', 'price': 5699.00, 'stock': 40, 'category': home_light, 'image': 'https://picsum.photos/seed/light22/800/600'},
        {'name': 'Adjustable Floor Reading Lamp', 'slug': 'adjustable-floor-lamp', 'description': 'Sleek metal floor lamp with an adjustable heavy-duty gooseneck. Focus light exactly where you need it for reading or crafts.', 'price': 4799.00, 'stock': 75, 'category': home_light, 'image': 'https://picsum.photos/seed/light23/800/600'},
        {'name': 'Geometric Hexagon Wall Lights', 'slug': 'geometric-hexagon-wall', 'description': 'Modular touch-sensitive wall panels. Create unique shapes and patterns to illuminate your creative space.', 'price': 4299.00, 'stock': 50, 'category': home_light, 'image': 'https://picsum.photos/seed/light24/800/600'},
        {'name': 'Industrial Tripod Floor Lamp', 'slug': 'industrial-tripod-lamp', 'description': 'A statement piece for any living room. Solid pine wood legs and a matte black theater-style directional shade.', 'price': 11099.00, 'stock': 15, 'category': home_light, 'image': 'https://picsum.photos/seed/light25/800/600'},
        {'name': 'Rattan Woven Lampshade', 'slug': 'rattan-woven-lampshade', 'description': 'Bohemian style hand-woven rattan lampshade. Diffuses soft, warm light creating a relaxing, natural atmosphere.', 'price': 3699.00, 'stock': 60, 'category': home_light, 'image': 'https://picsum.photos/seed/light26/800/600'},

        # --- Outdoor Lighting ---
        {'name': 'Waterproof LED Floodlight', 'slug': 'waterproof-led-floodlight', 'description': 'Ultra-bright 50W LED floodlight with IP66 weather resistance. Perfect for illuminating driveways, gardens, and patios securely.', 'price': 3099.00, 'stock': 50, 'category': out_light, 'image': 'https://picsum.photos/seed/light6/800/600'},
        {'name': 'Solar Powered Pathway Lights', 'slug': 'solar-pathway-lights', 'description': 'Set of 6 premium solar outdoor lights. Automatically turns on at dusk to guide your way with zero electricity cost.', 'price': 2599.00, 'stock': 60, 'category': out_light, 'image': 'https://picsum.photos/seed/light7/800/600'},
        {'name': 'Vintage Outdoor Wall Lantern', 'slug': 'vintage-outdoor-lantern', 'description': 'Classic wall-mounted porch light featuring seeded glass panels and an oil-rubbed bronze finish. Waterproof and durable.', 'price': 4699.00, 'stock': 45, 'category': out_light, 'image': 'https://picsum.photos/seed/light27/800/600'},
        {'name': 'LED Deck Step Lights', 'slug': 'led-deck-step-lights', 'description': 'Pack of 8 low-voltage LED step lights. Enhance the safety and beauty of your stairs, decks, and fences at night.', 'price': 3399.00, 'stock': 90, 'category': out_light, 'image': 'https://picsum.photos/seed/light28/800/600'},
        {'name': 'Motion Sensor Security Floodlight', 'slug': 'motion-sensor-floodlight', 'description': 'Dual-head high power LED floodlight with advanced infrared motion detection. Keep your home safe and secure.', 'price': 4299.00, 'stock': 55, 'category': out_light, 'image': 'https://picsum.photos/seed/light29/800/600'},
        {'name': 'Solar LED String Fairy Lights', 'slug': 'solar-fairy-lights', 'description': '100ft decorative copper wire string lights to easily wrap around trees, patios, and pergolas. Powered entirely by the sun.', 'price': 1499.00, 'stock': 120, 'category': out_light, 'image': 'https://picsum.photos/seed/light30/800/600'},
        {'name': 'Heavy Duty Festoon Lights', 'slug': 'heavy-duty-festoon', 'description': 'Commercial-grade string lights with shatterproof bulbs. Transform your backyard into a romantic cafe setting.', 'price': 5999.00, 'stock': 35, 'category': out_light, 'image': 'https://picsum.photos/seed/light31/800/600'},
        {'name': 'Submersible Pond Spotlights', 'slug': 'submersible-pond-lights', 'description': 'Fully waterproof RGB spotlights for pools, ponds, or fountains. Ships with remote control for easy color adjustment.', 'price': 2399.00, 'stock': 80, 'category': out_light, 'image': 'https://picsum.photos/seed/light32/800/600'}
    ]

    for p in products:
        Product.objects.create(**p)
    
    print("Brightify Lighting Database seeded successfully with fresh data!")

if __name__ == '__main__':
    seed_db()
