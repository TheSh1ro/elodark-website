"""
Serializers para autenticação
"""

from rest_framework import serializers
from users.models import User, BoosterProfile


class BoosterProfileSerializer(serializers.ModelSerializer):
    """Serializer para perfil de booster"""

    class Meta:
        model = BoosterProfile
        fields = [
            'rating',
            'completed_orders',
            'success_rate',
            'balance',
            'pending_balance',
            'verified',
            'joined_at',
            'bio',
        ]


class UserSerializer(serializers.ModelSerializer):
    """Serializer para usuário"""

    booster_profile = BoosterProfileSerializer(read_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'name',
            'avatar',
            'role',
            'google_id',
            'discord_id',
            'is_verified',
            'created_at',
            'updated_at',
            'booster_profile',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        """
        Customiza a saída do serializer
        Só inclui booster_profile se o usuário for booster
        """
        data = super().to_representation(instance)

        # Remove booster_profile se não for booster
        if instance.role != 'booster':
            data.pop('booster_profile', None)

        return data


class GoogleOAuthSerializer(serializers.Serializer):
    """Serializer para login OAuth com Google"""

    code = serializers.CharField(required=True, help_text="Código OAuth retornado pelo Google")
    redirect_uri = serializers.CharField(required=True, help_text="URI de redirecionamento usado no OAuth")


class DiscordOAuthSerializer(serializers.Serializer):
    """Serializer para login OAuth com Discord"""

    code = serializers.CharField(required=True, help_text="Código OAuth retornado pelo Discord")
    redirect_uri = serializers.CharField(required=True, help_text="URI de redirecionamento usado no OAuth")


class TokenRefreshSerializer(serializers.Serializer):
    """Serializer para renovar token"""

    refresh = serializers.CharField(required=True, help_text="Refresh token")


class AuthResponseSerializer(serializers.Serializer):
    """Serializer para resposta de autenticação"""

    user = UserSerializer(read_only=True)
    token = serializers.CharField(read_only=True)
    refresh_token = serializers.CharField(read_only=True, source='refreshToken')
    expires_in = serializers.IntegerField(read_only=True, source='expiresIn')