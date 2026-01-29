"""
Custom User Model
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Manager customizado para o modelo User"""

    def create_user(self, email, password=None, **extra_fields):
        """Cria e retorna um usuário comum"""
        if not email:
            raise ValueError('Email é obrigatório')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password:
            user.set_password(password)

        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Cria e retorna um superusuário"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de usuário customizado
    Usa email ao invés de username
    """

    ROLE_CHOICES = [
        ('client', 'Cliente'),
        ('booster', 'Booster'),
        ('admin', 'Administrador'),
    ]

    # Campos básicos
    email = models.EmailField(unique=True, verbose_name='E-mail')
    name = models.CharField(max_length=255, verbose_name='Nome')
    avatar = models.URLField(blank=True, null=True, verbose_name='Avatar')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client', verbose_name='Papel')

    # OAuth IDs
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True, verbose_name='Google ID')
    discord_id = models.CharField(max_length=255, blank=True, null=True, unique=True, verbose_name='Discord ID')

    # Flags
    is_active = models.BooleanField(default=True, verbose_name='Ativo')
    is_staff = models.BooleanField(default=False, verbose_name='Staff')
    is_verified = models.BooleanField(default=False, verbose_name='E-mail verificado')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')
    last_login = models.DateTimeField(null=True, blank=True, verbose_name='Último login')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name.split()[0] if self.name else ''

    @property
    def is_client(self):
        return self.role == 'client'

    @property
    def is_booster(self):
        return self.role == 'booster'

    @property
    def is_admin(self):
        return self.role == 'admin'


class BoosterProfile(models.Model):
    """
    Perfil adicional para boosters
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='booster_profile')

    # Estatísticas
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, verbose_name='Avaliação')
    completed_orders = models.IntegerField(default=0, verbose_name='Pedidos concluídos')
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name='Taxa de sucesso (%)')

    # Financeiro
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Saldo disponível')
    pending_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Saldo pendente')

    # Verificação
    verified = models.BooleanField(default=False, verbose_name='Verificado')
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name='Entrou como booster em')

    # Bio
    bio = models.TextField(blank=True, null=True, verbose_name='Biografia')

    class Meta:
        verbose_name = 'Perfil de Booster'
        verbose_name_plural = 'Perfis de Boosters'

    def __str__(self):
        return f'Booster: {self.user.name}'