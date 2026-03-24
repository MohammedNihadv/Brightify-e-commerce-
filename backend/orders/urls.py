from django.urls import path
from . import views

urlpatterns = [
    path('', views.getOrders, name='orders'),
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='deliver'),
    path('<str:pk>/revert-deliver/', views.revertOrderToDelivered, name='revert-deliver'),
    path('<str:pk>/ship/', views.updateOrderToShipped, name='ship'),
    path('<str:pk>/revert-ship/', views.revertOrderToShipped, name='revert-ship'),
    path('<str:pk>/out-for-delivery/', views.updateOrderToOutForDelivery, name='out-for-delivery'),
    path('<str:pk>/revert-out-for-delivery/', views.revertOrderToOutForDelivery, name='revert-out-for-delivery'),
]
