"""
Django Admin para User model
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, BoosterProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin customizado para User"""

    list_display = ['email', 'name', 'role', 'is_active', 'is_verified', 'created_at']
    list_filter = ['role', 'is_active', 'is_verified', 'created_at']
    search_fields = ['email', 'name', 'google_id', 'discord_id']
    ordering = ['-created_at']

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('email', 'name', 'avatar', 'role')
        }),
        ('OAuth', {
            'fields': ('google_id', 'discord_id')
        }),
        ('Permissões', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'groups', 'user_permissions')
        }),
        ('Datas', {
            'fields': ('last_login', 'created_at', 'updated_at')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'role'),
        }),
    )

    readonly_fields = ['created_at', 'updated_at', 'last_login']


@admin.register(BoosterProfile)
class BoosterProfileAdmin(admin.ModelAdmin):
    """Admin para BoosterProfile"""

    list_display = ['user', 'rating', 'completed_orders', 'success_rate', 'verified', 'balance']
    list_filter = ['verified', 'joined_at']
    search_fields = ['user__email', 'user__name']
    ordering = ['-joined_at']

    fieldsets = (
        ('Usuário', {
            'fields': ('user',)
        }),
        ('Estatísticas', {
            'fields': ('rating', 'completed_orders', 'success_rate')
        }),
        ('Financeiro', {
            'fields': ('balance', 'pending_balance')
        }),
        ('Status', {
            'fields': ('verified', 'joined_at', 'bio')
        }),
    )

    readonly_fields = ['joined_at']