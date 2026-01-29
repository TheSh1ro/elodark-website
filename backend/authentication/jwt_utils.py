"""
Utilitários para JWT
"""

import jwt
from datetime import datetime, timedelta
from django.conf import settings
from users.models import User


def generate_tokens(user: User) -> dict:
    """
    Gera access token e refresh token para o usuário

    Args:
        user: Instância do modelo User

    Returns:
        dict com 'token', 'refreshToken' e 'expiresIn'
    """
    now = datetime.utcnow()

    # Payload do access token
    access_payload = {
        'user_id': str(user.id),
        'email': user.email,
        'role': user.role,
        'exp': now + settings.JWT_ACCESS_TOKEN_LIFETIME,
        'iat': now,
        'type': 'access'
    }

    # Payload do refresh token
    refresh_payload = {
        'user_id': str(user.id),
        'exp': now + settings.JWT_REFRESH_TOKEN_LIFETIME,
        'iat': now,
        'type': 'refresh'
    }

    # Gera tokens
    access_token = jwt.encode(
        access_payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    refresh_token = jwt.encode(
        refresh_payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    # Retorna em segundos
    expires_in = int(settings.JWT_ACCESS_TOKEN_LIFETIME.total_seconds())

    return {
        'token': access_token,
        'refreshToken': refresh_token,
        'expiresIn': expires_in
    }


def decode_token(token: str) -> dict:
    """
    Decodifica e valida um JWT token

    Args:
        token: Token JWT

    Returns:
        Payload do token decodificado

    Raises:
        jwt.ExpiredSignatureError: Se token expirou
        jwt.InvalidTokenError: Se token é inválido
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise jwt.ExpiredSignatureError('Token expirado')
    except jwt.InvalidTokenError:
        raise jwt.InvalidTokenError('Token inválido')


def verify_refresh_token(refresh_token: str) -> User:
    """
    Verifica refresh token e retorna o usuário

    Args:
        refresh_token: Refresh token JWT

    Returns:
        Instância do User

    Raises:
        ValueError: Se token é inválido ou usuário não existe
    """
    try:
        payload = decode_token(refresh_token)

        # Verifica se é refresh token
        if payload.get('type') != 'refresh':
            raise ValueError('Token inválido')

        # Busca usuário
        user_id = payload.get('user_id')
        user = User.objects.get(id=user_id, is_active=True)

        return user

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        raise ValueError('Refresh token inválido ou expirado')
    except User.DoesNotExist:
        raise ValueError('Usuário não encontrado')