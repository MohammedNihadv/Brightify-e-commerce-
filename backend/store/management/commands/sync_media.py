import os
from django.core.management.base import BaseCommand
from django.core.files.storage import default_storage
from store.models import Product, Category
from django.conf import settings

class Command(BaseCommand):
    help = 'Syncs local media files to the current storage backend (e.g. S3)'

    def handle(self, *args, **options):
        self.stdout.write("Starting media sync to S3...")
        
        # Sync Products
        products = Product.objects.all()
        for product in products:
            if product.image:
                name = str(product.image)
                # If it's a URL, skip
                if name.startswith('http'):
                    continue
                
                # Check if it exists in local media root
                local_path = os.path.join(settings.MEDIA_ROOT, name)
                if os.path.exists(local_path):
                    self.stdout.write(f"Syncing {name}...")
                    try:
                        with open(local_path, 'rb') as f:
                            # Save to default_storage (S3 if active)
                            if not default_storage.exists(name):
                                default_storage.save(name, f)
                                self.stdout.write(self.style.SUCCESS(f"Successfully uploaded {name}"))
                            else:
                                self.stdout.write(f"{name} already exists in storage")
                    except Exception as e:
                        self.stderr.write(self.style.ERROR(f"Failed to sync {name}: {str(e)}"))
                else:
                    self.stdout.write(self.style.WARNING(f"File not found locally: {local_path}"))

        self.stdout.write(self.style.SUCCESS("Media sync completed!"))
