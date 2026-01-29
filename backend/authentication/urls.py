"""
URLs do app de autenticação
"""

from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # OAuth
    path('google/', views.google_oauth, name='google_oauth'),
    path('discord/', views.discord_oauth, name='discord_oauth'),

    # Token
    path('refresh/', views.token_refresh, name='token_refresh'),

    # User
    path('me/', views.me, name='me'),
    path('logout/', views.logout, name='logout'),
]