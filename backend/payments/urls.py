from django.urls import path
from . import views

urlpatterns = [
    path('create/<str:pk>/', views.createRazorpayOrder, name='razorpay-create'),
    path('verify/<str:pk>/', views.verifyRazorpayPayment, name='razorpay-verify'),
]
