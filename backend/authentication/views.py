"""
Views de autenticação
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.utils import timezone

from users.models import User, BoosterProfile
from .serializers import (
    GoogleOAuthSerializer,
    TokenRefreshSerializer,
    UserSerializer,
    AuthResponseSerializer
)
from .jwt_utils import generate_tokens, verify_refresh_token


@api_view(['POST'])
@permission_classes([AllowAny])
def google_oauth(request):
    """
    Endpoint para login OAuth com Google

    POST /api/auth/google/
    Body: { "code": "...", "redirect_uri": "..." }
    """
    serializer = GoogleOAuthSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    code = serializer.validated_data['code']
    redirect_uri = serializer.validated_data['redirect_uri']

    try:
        # Troca código por token
        from google_auth_oauthlib.flow import Flow

        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            },
            scopes=[
                'openid',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ],
            redirect_uri=redirect_uri
        )

        # Troca o code por tokens
        flow.fetch_token(code=code)

        # Pega o ID token
        credentials = flow.credentials
        id_info = id_token.verify_oauth2_token(
            credentials.id_token,
            requests.Request(),
            settings.GOOGLE_OAUTH_CLIENT_ID
        )

        # Extrai dados do usuário
        google_id = id_info['sub']
        email = id_info['email']
        name = id_info.get('name', email.split('@')[0])
        avatar = id_info.get('picture', '')
        email_verified = id_info.get('email_verified', False)

        # Busca ou cria usuário
        try:
            # Tenta buscar por google_id primeiro
            user = User.objects.get(google_id=google_id)
            # Usuário já existe, atualiza dados
            user.name = name
            user.avatar = avatar
            user.is_verified = email_verified
            user.last_login = timezone.now()
            user.save()

        except User.DoesNotExist:
            # Verifica se já existe usuário com esse email (sem google_id)
            try:
                user = User.objects.get(email=email)
                # Associa google_id ao usuário existente
                user.google_id = google_id
                user.name = name
                user.avatar = avatar
                user.is_verified = email_verified
                user.last_login = timezone.now()
                user.save()

            except User.DoesNotExist:
                # Cria novo usuário
                user = User.objects.create(
                    google_id=google_id,
                    email=email,
                    name=name,
                    avatar=avatar,
                    is_verified=email_verified,
                    role='client',  # Novo usuário sempre começa como client
                )

        # Gera tokens JWT
        tokens = generate_tokens(user)

        # Prepara resposta
        response_data = {
            'user': UserSerializer(user).data,
            **tokens
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {
                'error': True,
                'message': f'Erro ao autenticar com Google: {str(e)}',
                'code': 'GOOGLE_AUTH_ERROR'
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def discord_oauth(request):
    """
    Endpoint para login OAuth com Discord (FUTURO)

    POST /api/auth/discord/
    Body: { "code": "...", "redirect_uri": "..." }
    """
    return Response(
        {
            'error': True,
            'message': 'Login com Discord será implementado em breve',
            'code': 'NOT_IMPLEMENTED'
        },
        status=status.HTTP_501_NOT_IMPLEMENTED
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def token_refresh(request):
    """
    Endpoint para renovar access token usando refresh token

    POST /api/auth/refresh/
    Body: { "refresh": "..." }
    """
    serializer = TokenRefreshSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    refresh_token = serializer.validated_data['refresh']

    try:
        # Verifica refresh token e pega usuário
        user = verify_refresh_token(refresh_token)

        # Atualiza last_login
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        # Gera novos tokens
        tokens = generate_tokens(user)

        # Prepara resposta
        response_data = {
            'user': UserSerializer(user).data,
            **tokens
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except ValueError as e:
        return Response(
            {
                'error': True,
                'message': str(e),
                'code': 'INVALID_REFRESH_TOKEN'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Retorna dados do usuário autenticado

    GET /api/auth/me/
    Headers: { "Authorization": "Bearer <token>" }
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Faz logout do usuário

    POST /api/auth/logout/
    Headers: { "Authorization": "Bearer <token>" }

    Nota: Como JWT é stateless, apenas retornamos sucesso.
    O frontend deve remover o token do localStorage.
    """
    return Response(
        {
            'message': 'Logout realizado com sucesso'
        },
        status=status.HTTP_200_OK
    )