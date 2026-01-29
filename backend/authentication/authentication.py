"""
Autenticação JWT customizada para Django REST Framework
"""

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
import jwt

from users.models import User
from .jwt_utils import decode_token


class JWTAuthentication(BaseAuthentication):
    """
    Autenticação JWT customizada
    Espera header: Authorization: Bearer <token>
    """

    keyword = 'Bearer'

    def authenticate(self, request):
        """
        Autentica a requisição usando JWT token

        Returns:
            tuple (user, token) ou None
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if not auth_header:
            return None

        try:
            # Separa "Bearer" do token
            parts = auth_header.split()

            if len(parts) != 2:
                raise AuthenticationFailed(_('Header de autorização inválido'))

            if parts[0] != self.keyword:
                raise AuthenticationFailed(_('Header de autorização deve começar com Bearer'))

            token = parts[1]

            # Decodifica token
            payload = decode_token(token)

            # Verifica se é access token
            if payload.get('type') != 'access':
                raise AuthenticationFailed(_('Token inválido'))

            # Busca usuário
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id, is_active=True)

            return (user, token)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(_('Token expirado'))
        except jwt.InvalidTokenError:
            raise AuthenticationFailed(_('Token inválido'))
        except User.DoesNotExist:
            raise AuthenticationFailed(_('Usuário não encontrado'))
        except Exception as e:
            raise AuthenticationFailed(str(e))

    def authenticate_header(self, request):
        """
        Retorna string para WWW-Authenticate header
        """
        return self.keyword