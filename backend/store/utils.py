import os
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

def optimize_image(image_field, max_width=1200, quality=80):
    """
    Optimizes an ImageField by resizing it and converting it to WebP.
    """
    if not image_field:
        return

    try:
        # Open the image
        img = Image.open(image_field)
        
        # Check if resizing is needed
        if img.width > max_width:
            output_size = (max_width, int((max_width / img.width) * img.height))
            img = img.resize(output_size, Image.LANCZOS)

        # Handle transparency if converting to RGB (WebP supports RGBA but we'll ensure compatibility)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        # Save to BytesIO
        buffer = BytesIO()
        img.save(buffer, format="WEBP", quality=quality, method=6) # method 6 is slowest/best compression
        buffer.seek(0)

        # Get the original filename without extension
        filename = os.path.splitext(os.path.basename(image_field.name))[0]
        new_filename = f"{filename}.webp"

        # Update the image field
        image_field.save(new_filename, ContentFile(buffer.read()), save=False)
        
    except Exception as e:
        print(f"Error optimizing image: {e}")
