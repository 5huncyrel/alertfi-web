from rest_framework import serializers
from .models import User, SensorData, HistoryLog
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from .validators import validate_email_domain, validate_password_strength

# User Registration Serializer
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']

    def validate_email(self, value):
        validate_email_domain(value)
        return value

    def validate_password(self, value):
        validate_password_strength(value)
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        return user

# User Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

# SensorData Serializer
class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = '__all__'  # Includes all fields in the SensorData model

# HistoryLog Serializer
class HistoryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryLog
        fields = ['sensor_data', 'action_taken', 'timestamp']
