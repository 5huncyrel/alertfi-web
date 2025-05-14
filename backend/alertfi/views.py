from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.core.cache import cache
from django.conf import settings
from .models import User, SensorData, HistoryLog
import jwt
from django.shortcuts import get_object_or_404
from .serializers import RegisterSerializer, LoginSerializer, SensorDataSerializer, HistoryLogSerializer

# Register User
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)
        user = serializer.save()

        token = default_token_generator.make_token(user)
        verification_url = request.build_absolute_uri(
            reverse('verify_email', args=[user.pk, token])
        )
        send_mail(
            'Verify your AlertFi account',
            f'Click this link to verify your email: {verification_url}',
            'noreply@alertfi.com',
            [user.email],
            fail_silently=False,
        )
        return Response({'message': 'User created. Please verify your email.'}, status=201)

    return Response(serializer.errors, status=400)

# Verify Email
@api_view(['GET'])
def verify_email(request, user_id, token):
    user = get_object_or_404(User, pk=user_id)
    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'message': 'Email verified successfully.'})
    else:
        return Response({'error': 'Invalid or expired token.'}, status=400)

# Login User with attempt limit
@api_view(['POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        cache_key = f'login_attempts_{email}'
        attempts = cache.get(cache_key, 0)

        if attempts >= 5:
            return Response({'error': 'Too many attempts. Try again in 5 minutes.'}, status=403)

        user = authenticate(request, email=email, password=password)
        if user:
            if not user.is_active:
                return Response({'error': 'Please verify your email first.'}, status=403)
            cache.delete(cache_key)
            token = jwt.encode({'id': user.id, 'email': user.email}, settings.SECRET_KEY, algorithm='HS256')
            return Response({'access': token})
        else:
            cache.set(cache_key, attempts + 1, timeout=300)
            return Response({'error': 'Invalid credentials'}, status=400)
    return Response(serializer.errors, status=400)

# Forgot Password
@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        reset_url = request.build_absolute_uri(reverse('reset_password', args=[user.pk, token]))
        send_mail(
            'Reset Your Password',
            f'Click here: {reset_url}',
            'noreply@alertfi.com',
            [user.email]
        )
        return Response({'message': 'Reset email sent'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

# Reset Password
@api_view(['POST'])
def reset_password(request, user_id, token):
    new_password = request.data.get('new_password')
    try:
        user = User.objects.get(pk=user_id)
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful'})
        return Response({'error': 'Invalid or expired token'}, status=400)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

# Get Latest Sensor Data
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_latest_sensor_data(request):
    sensor_data = SensorData.objects.order_by('-timestamp').first()
    if sensor_data:
        return Response({"ppm": sensor_data.ppm, "status": sensor_data.status})
    return Response({'error': 'No data'}, status=404)

# Get Sensor History
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sensor_history(request):
    history = SensorData.objects.all().order_by('-timestamp')[:10]
    serializer = SensorDataSerializer(history, many=True)
    return Response(serializer.data)

# Create History Log
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_history_log(request):
    sensor_id = request.data.get('sensor_id')
    action_taken = request.data.get('action_taken')
    if sensor_id and action_taken:
        try:
            sensor_data = SensorData.objects.get(id=sensor_id)
            log = HistoryLog.objects.create(sensor_data=sensor_data, action_taken=action_taken)
            serializer = HistoryLogSerializer(log)
            return Response(serializer.data, status=201)
        except SensorData.DoesNotExist:
            return Response({'error': 'Sensor not found'}, status=404)
    return Response({'error': 'Invalid data'}, status=400)

sensor_state = {"on": True}

@api_view(['GET', 'POST'])
def sensor_control(request):
    global sensor_state
    if request.method == 'GET':
        return Response({"sensor_on": sensor_state["on"]})
    elif request.method == 'POST':
        sensor_state["on"] = request.data.get("sensor_on", True)
        return Response({"sensor_on": sensor_state["on"]}, status=status.HTTP_200_OK)

@api_view(['POST'])
def update_sensor_data(request):
    ppm = request.data.get('ppm')
    if ppm is not None:
        status_value = "Safe"
        ppm = float(ppm)
        if ppm > 1000:
            status_value = "Fire Risk"
        elif ppm > 500:
            status_value = "Warning"

        sensor_data = SensorData.objects.create(ppm=ppm, status=status_value)
        return Response({"message": "Sensor data updated", "ppm": ppm, "status": status_value})
    return Response({"error": "PPM value required"}, status=400)
