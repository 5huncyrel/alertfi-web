from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, SensorData, HistoryLog

# Custom UserAdmin
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'first_name', 'last_name', 'password1', 'password2',
                'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'
            ),
        }),
    )

# Register SensorData model
@admin.register(SensorData)
class SensorDataAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'ppm', 'timestamp')
    list_filter = ('status', 'timestamp', 'user')
    search_fields = ('user__email', 'status')

# Register HistoryLog model
@admin.register(HistoryLog)
class HistoryLogAdmin(admin.ModelAdmin):
    list_display = ('sensor_data', 'action_taken', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('sensor_data__status', 'action_taken')
