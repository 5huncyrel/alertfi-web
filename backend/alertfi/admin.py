from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, SensorData, HistoryLog

# Custom UserAdmin
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ['email']            # was ['username']
    list_display = ['email', 'is_staff', 'is_active']  # remove 'username'
    search_fields = ['email']

    # Override fieldsets to include email instead of username
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
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
