from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.utils import timezone
from .models import Order, OrderItem, ShippingAddress
from store.models import Product
from .serializers import OrderSerializer
from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data.get('orderItems')

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # (1) Create order
        order = Order.objects.create(
            user=user,
            payment_method=data['paymentMethod'],
            tax_price=0,
            shipping_price=0,
            total_price=data['totalPrice']
        )

        # (2) Create shipping address
        shipping = ShippingAddress.objects.create(
            user=user,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postal_code=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
            phone=data['shippingAddress']['phone'],
        )
        
        # NOTE: because order has a OneToOne to ShippingAddress, we assign it:
        order.shipping_address = shipping
        order.save()

        # (3) Create order items and set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(id=i['product'])
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.name if product.image else ''
            )

            # (4) Update stock
            product.stock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

from .serializers import OrderSerializer, OrderSlimSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.select_related('user').all().order_by('-created_at')
    serializer = OrderSlimSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(id=pk)
    
    order.is_paid = True
    order.paid_at = timezone.now()
    order.save()

    return Response('Order was paid')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(id=pk)
    
    order.is_delivered = True
    order.delivered_at = timezone.now()
    order.save()

    return Response('Order was delivered')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToShipped(request, pk):
    order = Order.objects.get(id=pk)
    
    order.is_shipped = True
    order.shipped_at = timezone.now()
    order.save()

    return Response('Order was shipped')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToOutForDelivery(request, pk):
    order = Order.objects.get(id=pk)
    
    order.is_out_for_delivery = True
    order.out_for_delivery_at = timezone.now()
    order.save()

    return Response('Order was marked out for delivery')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def revertOrderToShipped(request, pk):
    order = Order.objects.get(id=pk)
    
    order.is_shipped = False
    order.shipped_at = None
    order.save()

    return Response('Order shipped status reverted')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def revertOrderToOutForDelivery(request, pk):
    order = Order.objects.get(id=pk)
    
    order.is_out_for_delivery = False
    order.out_for_delivery_at = None
    order.save()

    return Response('Order out-for-delivery status reverted')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def revertOrderToDelivered(request, pk):
    order = Order.objects.get(id=pk)
    
    order.is_delivered = False
    order.delivered_at = None
    order.save()

    return Response('Order delivered status reverted')
