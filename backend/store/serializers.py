from rest_framework import serializers
from .models import Category, Product, Review, Banner

class BannerSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = '__all__'

    def get_image(self, obj):
        if not obj.image:
            return None
        try:
            image_url = str(obj.image)
            if image_url.startswith('http'):
                return image_url
            return obj.image.url
        except Exception:
            return None
import urllib.parse

class ReviewSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'

    def get_name(self, obj):
        if obj.user:
            name = obj.user.first_name
            if not name:
                name = obj.user.username
            
            # If name is an email, take the part before @
            if '@' in name:
                name = name.split('@')[0]
                
            return name.capitalize()
        return "Anonymous"

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_image(self, obj):
        if not obj.image:
            return None
            
        try:
            image_url = str(obj.image)
            if image_url.startswith('http'):
                return image_url
            return obj.image.url
        except Exception:
            return None

class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    category_name = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name
        return None

    def get_category_slug(self, obj):
        if obj.category:
            return obj.category.slug
        return None

    def get_image(self, obj):
        if not obj.image:
            return None
            
        try:
            image_url = str(obj.image)
            # If the image field already contains a full URL (e.g. from seed data)
            if image_url.startswith('http'):
                return image_url
                
            # Otherwise, use the S3 backend to generate a valid presigned URL
            return obj.image.url
        except Exception:
            return None
class ProductSlimSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'is_active', 'category_name', 'category_slug', 'image', 'slug', 'created_at']

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name
        return None

    def get_category_slug(self, obj):
        if obj.category:
            return obj.category.slug
        return None

    def get_image(self, obj):
        if not obj.image:
            return None
        try:
            image_url = str(obj.image)
            if image_url.startswith('http'):
                return image_url
            return obj.image.url
        except Exception:
            return None
