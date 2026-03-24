from django.contrib import admin
from .models import Order, OrderItem, ShippingAddress

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'total_price', 'is_paid', 'is_delivered')
    list_filter = ('is_paid', 'is_delivered')
    inlines = [OrderItemInline]

admin.site.register(ShippingAddress)
