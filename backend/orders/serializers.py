from rest_framework import serializers
from .models import Order, OrderItem, ShippingAddress

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'

    def get_image(self, obj):
        if not obj.image:
            return None
            
        try:
            # 1. Best case: Get fresh URL from the product (handles S3/local automatically)
            if obj.product and obj.product.image:
                return obj.product.image.url
                
            image_url = str(obj.image)
            
            # 2. If it's a full URL and not an expired S3 one, return as is
            if image_url.startswith('http') and 'X-Amz-Signature' not in image_url:
                return image_url
            
            # 3. If it looks like a path (or we want to re-sign an expired one)
            # Strip query params if it's a full S3 URL to get the clean path
            if '?' in image_url:
                image_url = image_url.split('?')[0]
            
            # If it's still a full Supabase S3 URL, we might need to extract the relative path
            if 'amazonaws.com' in image_url or 'supabase.co' in image_url:
                # Extract path after the bucket name
                # e.g. https://.../brightify-media/products/img.jpg
                from django.conf import settings
                bucket = settings.AWS_STORAGE_BUCKET_NAME
                if bucket in image_url:
                    image_url = image_url.split(bucket)[-1]
            
            # Ensure leading slash for local or relative path for storage.url()
            if image_url.startswith('/'):
                 image_url = image_url[1:]
                 
            from django.core.files.storage import default_storage
            return default_storage.url(image_url)
            
        except Exception as e:
            print(f"DEBUG: OrderItemSerializer.get_image error: {e}")
            return obj.image

class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField(read_only=True)
    shipping_address = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']

    def get_order_items(self, obj):
        items = obj.order_items.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shipping_address(self, obj):
        try:
            address = ShippingAddressSerializer(obj.shipping_address, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = {"name": user.first_name, "email": user.email} if user else None
        return serializer
class OrderSlimSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    phone = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'total_price', 'created_at', 'phone',
            'is_paid', 'paid_at', 
            'is_shipped', 'shipped_at', 
            'is_out_for_delivery', 'out_for_delivery_at', 
            'is_delivered', 'delivered_at'
        ]

    def get_user(self, obj):
        user = obj.user
        return {"name": user.first_name, "email": user.email} if user else None

    def get_phone(self, obj):
        try:
            return obj.shipping_address.phone
        except:
            return None
