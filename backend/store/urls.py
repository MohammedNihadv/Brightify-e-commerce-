from django.urls import path
from . import views

urlpatterns = [
    path('admin/stats/', views.getAdminStats, name='admin-stats'),
    path('', views.getProducts, name='products'),
    path('create/', views.createProduct, name='product-create'),
    path('update/<str:pk>/', views.updateProduct, name='product-update'),
    path('delete/<str:pk>/', views.deleteProduct, name='product-delete'),
    
    path('categories/', views.getCategories, name='categories'),
    path('categories/create/', views.createCategory, name='category-create'),
    path('categories/update/<str:pk>/', views.updateCategory, name='category-update'),
    path('categories/delete/<str:pk>/', views.deleteCategory, name='category-delete'),
    path('categories/<str:slug>/', views.getCategoryProducts, name='category-products'),
    
    path('banners/', views.getBanners, name='banners'),
    path('banners/admin/', views.getAdminBanners, name='banners-admin'),
    path('banners/create/', views.createBanner, name='banner-create'),
    path('banners/update/<str:pk>/', views.updateBanner, name='banner-update'),
    path('banners/delete/<str:pk>/', views.deleteBanner, name='banner-delete'),
    
    path('<str:slug>/', views.getProduct, name='product'),
    path('reviews/<str:pk>/', views.createProductReview, name='create-review'),
]
