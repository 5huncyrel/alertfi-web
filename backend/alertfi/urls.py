from django.urls import path
from . import views

urlpatterns = [
    path('api/register/', views.register),
    path('api/verify-email/<int:user_id>/<str:token>/', views.verify_email, name='verify_email'),
    path('api/login/', views.login_user),
    path('api/forgot-password/', views.forgot_password),
    path('api/reset-password/<int:user_id>/<str:token>/', views.reset_password, name='reset_password'),
    path('api/sensor/latest/', views.get_latest_sensor_data),
    path('api/sensor/history/', views.get_sensor_history),
    path('api/sensor/log/', views.create_history_log),
    path('api/sensor/control/', views.sensor_control),
    path('api/sensor/data/', views.update_sensor_data),
]