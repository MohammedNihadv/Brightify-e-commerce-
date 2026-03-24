from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import status
from .serializers import UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from .models import EmailOTP
import random
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data.get('name', ''),
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data

    user.first_name = data.get('name', user.first_name)
    user.username = data.get('email', user.username)
    user.email = data.get('email', user.email)
    user.phone_number = data.get('phone_number', user.phone_number)
    
    if data.get('password'):
        user.password = make_password(data['password'])

    user.save()
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    try:
        user = User.objects.get(id=pk)
        user.delete()
        return Response('User was deleted')
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def supabaseLogin(request):
    data = request.data
    email = data.get('email')
    
    if not email:
        return Response({'detail': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if user exists, if not create
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': data.get('name', email.split('@')[0]),
            }
        )
        
        # If it's a new user, we might want to mark them as verified or something
        # For now, just return standard JWT
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    try:
        user = User.objects.get(id=pk)
        data = request.data
        user.first_name = data.get('name', user.first_name)
        user.username = data.get('email', user.username)
        user.email = data.get('email', user.email)
        user.isAdmin = data.get('isAdmin', user.isAdmin)
        user.save()
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
from .utils import get_otp_email_html

@api_view(['POST'])
def sendEmailOTP(request):
    data = request.data
    email = data.get('email')

    if not email:
        return Response({'detail': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Generate 6-digit code
    code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    # Update or create OTP record
    otp_record, created = EmailOTP.objects.update_or_create(
        email=email,
        defaults={'code': code, 'created_at': timezone.now()}
    )

    try:
        subject = f'Your Brightify Verification Code: {code}'
        message = f'Use this code to sign in to your accounts: {code}\n\nThis code will expire in 10 minutes.'
        html_message = get_otp_email_html(code)
        
        send_mail(
            subject,
            message,
            None, # Uses DEFAULT_FROM_EMAIL from settings
            [email],
            fail_silently=False,
            html_message=html_message
        )
        return Response({'detail': 'OTP sent successfully'})
    except Exception as e:
        return Response({'detail': f'Error sending email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def verifyEmailOTP(request):
    data = request.data
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return Response({'detail': 'Email and code are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        otp_record = EmailOTP.objects.get(email=email)
        
        # Check if code matches
        if otp_record.code != code:
            return Response({'detail': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)

        # Check expiration (10 minutes)
        if otp_record.created_at < timezone.now() - timedelta(minutes=10):
            return Response({'detail': 'Verification code has expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Success - find or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': data.get('name', email.split('@')[0]),
            }
        )
        
        # Delete the used OTP code
        otp_record.delete()

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except EmailOTP.DoesNotExist:
        return Response({'detail': 'No OTP requested for this email'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
