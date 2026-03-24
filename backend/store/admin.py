from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, Review, Coupon, Banner

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_active')
    list_editable = ('price', 'stock', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description', 'slug')
    list_select_related = ('category',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'thumbnail_preview', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    
    def thumbnail_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 100px; height: auto;" />', obj.image.url)
        return "No Image"
    thumbnail_preview.short_description = 'Preview'

admin.site.register(Review)
admin.site.register(Coupon)
