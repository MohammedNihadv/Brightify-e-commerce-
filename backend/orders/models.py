from django.db import models
from django.conf import settings
from store.models import Product, Coupon

class ShippingAddress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, null=True, blank=True)
    shipping_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f'{self.address}, {self.city}'

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    shipping_address = models.OneToOneField(ShippingAddress, on_delete=models.SET_NULL, null=True, blank=True)
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)
    
    payment_method = models.CharField(max_length=1000, default='Razorpay')
    tax_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    shipping_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    razorpay_order_id = models.CharField(max_length=1000, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=1000, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=1000, null=True, blank=True)

    is_delivered = models.BooleanField(default=False)
    delivered_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    
    is_shipped = models.BooleanField(default=False)
    shipped_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    
    is_out_for_delivery = models.BooleanField(default=False)
    out_for_delivery_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=1000)
    qty = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.name
