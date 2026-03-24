from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework import status
from django.core.cache import cache

from .models import Product, Category, Review, Banner
from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer, BannerSerializer, ProductSlimSerializer

@api_view(['GET'])
def getBanners(request):
    banners_data = cache.get('banner_list')
    if banners_data is None:
        banners = Banner.objects.filter(is_active=True)
        serializer = BannerSerializer(banners, many=True)
        banners_data = serializer.data
        cache.set('banner_list', banners_data, 60 * 60) # Cache for 1 hour
    return Response(banners_data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAdminBanners(request):
    banners = Banner.objects.all()
    serializer = BannerSerializer(banners, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createBanner(request):
    data = request.data
    try:
        banner = Banner.objects.create(
            title=data.get('title', 'New Banner'),
            subtitle=data.get('subtitle', ''),
            link=data.get('link', ''),
            order=data.get('order', 0),
            is_active=str(data.get('is_active', 'true')).lower() == 'true'
        )
        if 'image' in request.FILES:
            banner.image = request.FILES['image']
            banner.save()
            
        cache.delete('banner_list')
        serializer = BannerSerializer(banner, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateBanner(request, pk):
    try:
        banner = Banner.objects.get(id=pk)
        data = request.data
        
        banner.title = data.get('title', banner.title)
        banner.subtitle = data.get('subtitle', banner.subtitle)
        banner.link = data.get('link', banner.link)
        banner.order = data.get('order', banner.order)
        
        is_active = data.get('is_active')
        if is_active is not None:
            banner.is_active = str(is_active).lower() == 'true'
            
        if 'image' in request.FILES:
            banner.image = request.FILES['image']
            
        banner.save()
        cache.delete('banner_list')
        serializer = BannerSerializer(banner, many=False)
        return Response(serializer.data)
    except Banner.DoesNotExist:
        return Response({'detail': 'Banner not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteBanner(request, pk):
    try:
        banner = Banner.objects.get(id=pk)
        banner.delete()
        cache.delete('banner_list')
        return Response('Banner deleted')
    except Banner.DoesNotExist:
        return Response({'detail': 'Banner not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword', '')
    is_admin_req = request.query_params.get('admin', 'false') == 'true'
    
    if is_admin_req:
        products = Product.objects.all()
    else:
        products = Product.objects.filter(is_active=True)
        
    products = products.filter(
        name__icontains=query
    ).select_related('category').prefetch_related('reviews').order_by('-created_at')

    # Pagination
    page = request.query_params.get('page', 1)
    paginator = Paginator(products, 12)
    try:
        if page == 'all':
            products_paginated = products
        else:
            products_paginated = paginator.page(page)
    except PageNotAnInteger:
        products_paginated = paginator.page(1)
    except EmptyPage:
        products_paginated = paginator.page(paginator.num_pages)

    if page == 'all':
        serializer = ProductSlimSerializer(products_paginated, many=True)
    else:
        serializer = ProductSerializer(products_paginated, many=True)
    
    return Response({
        'products': serializer.data,
        'page': int(page) if str(page).isdigit() else 1,
        'pages': paginator.num_pages if page != 'all' else 1
    })

@api_view(['GET'])
def getProduct(request, slug):
    try:
        product = Product.objects.select_related('category').prefetch_related('reviews').get(slug=slug, is_active=True)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getCategoryProducts(request, slug):
    try:
        category = Category.objects.get(slug=slug)
        products = category.products.filter(is_active=True).order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response({'category': CategorySerializer(category).data, 'products': serializer.data})
    except Category.DoesNotExist:
        return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    data = request.data
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    # 1. Review already exists
    alreadyExists = product.reviews.filter(user=user).exists()
    if alreadyExists:
        return Response({'detail': 'Product already reviewed'}, status=status.HTTP_400_BAD_REQUEST)

    # 2. No Rating or Rating is 0
    elif data.get('rating', 0) == 0:
        return Response({'detail': 'Please select a rating'}, status=status.HTTP_400_BAD_REQUEST)

    # 3. Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            rating=data['rating'],
            comment=data.get('comment', '')
        )
        return Response({'detail': 'Review Added'})
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    data = request.data
    try:
        category = Category.objects.get(id=data.get('category'))
        product = Product.objects.create(
            name=data['name'],
            price=data['price'],
            category=category,
            stock=data['stock'],
            description=data['description'],
            slug=data['slug']
        )
        # Handle image separately if it's in request.FILES
        if 'image' in request.FILES:
            product.image = request.FILES['image']
            product.save()
            
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    try:
        product = Product.objects.get(id=pk)
        
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.stock = data.get('stock', product.stock)
        product.description = data.get('description', product.description)
        product.slug = data.get('slug', product.slug)
        
        # Handle string booleans from FormData
        is_active = data.get('is_active')
        if is_active is not None:
            product.is_active = str(is_active).lower() == 'true'

        if data.get('category'):
            category = Category.objects.get(id=data['category'])
            product.category = category

        if 'image' in request.FILES:
            product.image = request.FILES['image']

        product.save()
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
        product.delete()
        return Response('Product deleted')
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAdminStats(request):
    from django.contrib.auth import get_user_model
    from django.apps import apps
    from django.db.models import Sum
    
    User = get_user_model()
    Order = apps.get_model('orders', 'Order')
    
    product_count = Product.objects.count()
    order_count = Order.objects.count()
    user_count = User.objects.count()
    total_revenue = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0
    pending_orders = Order.objects.filter(is_delivered=False).count()
    paid_orders = Order.objects.filter(is_paid=True).count()
    
    return Response({
        'productCount': product_count,
        'orderCount': order_count,
        'userCount': user_count,
        'totalRevenue': float(total_revenue),
        'pendingOrders': pending_orders,
        'paidOrders': paid_orders
    })

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createCategory(request):
    data = request.data
    try:
        category = Category.objects.create(
            name=data['name'],
            slug=data['slug'],
            description=data.get('description', '')
        )
        if 'image' in request.FILES:
            category.image = request.FILES['image']
            category.save()
        serializer = CategorySerializer(category, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateCategory(request, pk):
    try:
        category = Category.objects.get(id=pk)
        data = request.data
        category.name = data.get('name', category.name)
        category.slug = data.get('slug', category.slug)
        category.description = data.get('description', category.description)
        
        if 'image' in request.FILES:
            category.image = request.FILES['image']
            
        category.save()
        serializer = CategorySerializer(category, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteCategory(request, pk):
    try:
        category = Category.objects.get(id=pk)
        category.delete()
        return Response('Category deleted')
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
