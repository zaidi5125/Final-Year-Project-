# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Role


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'is_system_role']
    search_fields = ['name']


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'is_staff', 'is_active_member', 'force_password_change']
    filter_horizontal = ('roles',) + UserAdmin.filter_horizontal if hasattr(UserAdmin, 'filter_horizontal') else ('roles',)
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('roles', 'is_active_member', 'force_password_change')}),
    )