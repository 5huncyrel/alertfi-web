from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.core.validators import RegexValidator

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user


    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# Custom User Model
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[\w\.-]+@[\w\.-]+\.\w+(\.\w+)?$',
                message='Email must follow the pattern name@domain.tld or name@domain.tld.countrycode'
            )
        ]
    )
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'   # login will be by username now
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username



# SensorData model
class SensorData(models.Model):
    status_choices = [
        ('Safe', 'Safe'),
        ('Warning', 'Warning'),
        ('Danger', 'Danger'),
    ]

    timestamp = models.DateTimeField(auto_now_add=True)
    ppm = models.IntegerField()  # Gas level in PPM
    status = models.CharField(max_length=10, choices=status_choices, default='Safe')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sensor_data')

    def __str__(self):
        return f"{self.status} - {self.ppm} PPM at {self.timestamp}"


# History Log model (optional, if you want to explicitly separate history)
class HistoryLog(models.Model):
    sensor_data = models.ForeignKey(SensorData, on_delete=models.CASCADE)
    action_taken = models.CharField(max_length=255)  # e.g., 'Alert Triggered'
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Action: {self.action_taken} at {self.timestamp}"
