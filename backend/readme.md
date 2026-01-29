# 🐍 Backend Django - LoL Boost Platform

Sistema de autenticação OAuth completo com Django REST Framework, Google OAuth 2.0 e JWT.

---

## 📋 **Índice**

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Instalação e Configuração](#instalação-e-configuração)
6. [Modelos de Dados](#modelos-de-dados)
7. [Endpoints da API](#endpoints-da-api)
8. [Sistema de Autenticação](#sistema-de-autenticação)
9. [Fluxo OAuth Completo](#fluxo-oauth-completo)
10. [Variáveis de Ambiente](#variáveis-de-ambiente)
11. [Comandos Úteis](#comandos-úteis)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 **Visão Geral**

Backend Django que fornece:

- ✅ Autenticação OAuth 2.0 (Google)
- ✅ Sistema JWT (Access Token + Refresh Token)
- ✅ Modelo de usuário customizado (User)
- ✅ Perfil de Booster (para usuários boosters)
- ✅ API REST completa
- ✅ CORS configurado para frontend Vue.js
- ✅ Django Admin customizado

**Status:** Sistema de autenticação 100% funcional. Próximas implementações: serviços, pedidos, pagamentos.

---

## 🏗️ **Arquitetura**

```
┌─────────────────┐
│   Frontend Vue  │
│  (localhost:5173)│
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Backend Django │
│  (localhost:8000)│
├─────────────────┤
│ • OAuth Google  │
│ • JWT Tokens    │
│ • User Model    │
│ • REST API      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SQLite DB     │
│  (db.sqlite3)   │
└─────────────────┘
```

---

## 🛠️ **Tecnologias Utilizadas**

| Tecnologia            | Versão | Finalidade            |
| --------------------- | ------ | --------------------- |
| Python                | 3.10+  | Linguagem base        |
| Django                | 5.0.1  | Framework web         |
| Django REST Framework | 3.14.0 | API REST              |
| django-cors-headers   | 4.3.1  | CORS                  |
| python-decouple       | 3.8    | Variáveis de ambiente |
| google-auth           | 2.27.0 | OAuth Google          |
| google-auth-oauthlib  | 1.2.0  | OAuth flow            |
| PyJWT                 | 2.8.0  | JSON Web Tokens       |
| SQLite                | -      | Banco de dados (dev)  |

---

## 📂 **Estrutura de Arquivos**

```
lol-boost-backend/
│
├── config/                          # Configurações do projeto Django
│   ├── __init__.py
│   ├── settings.py                  # ⭐ Configurações principais
│   ├── urls.py                      # URLs raiz do projeto
│   ├── wsgi.py
│   └── asgi.py
│
├── users/                           # App de usuários
│   ├── __init__.py
│   ├── models.py                    # ⭐ User + BoosterProfile models
│   ├── admin.py                     # ⭐ Django Admin customizado
│   ├── apps.py
│   ├── migrations/
│   ├── tests.py
│   └── views.py
│
├── authentication/                  # App de autenticação
│   ├── __init__.py
│   ├── views.py                     # ⭐ Endpoints OAuth + JWT
│   ├── serializers.py               # ⭐ Serializers DRF
│   ├── urls.py                      # URLs do app
│   ├── jwt_utils.py                 # ⭐ Geração/validação JWT
│   ├── authentication.py            # ⭐ Classe de autenticação JWT
│   ├── exceptions.py                # Exception handler customizado
│   ├── apps.py
│   ├── migrations/
│   └── tests.py
│
├── manage.py                        # CLI do Django
├── db.sqlite3                       # Banco SQLite (não versionar)
├── requirements.txt                 # ⭐ Dependências Python
├── .env                             # ⭐ Variáveis de ambiente (não versionar)
├── .env.example                     # Template de .env
├── .gitignore                       # Git ignore
└── README.md                        # Esta documentação
```

### **Arquivos principais explicados:**

#### **config/settings.py**

Configurações do Django:

- `INSTALLED_APPS`: Apps Django + DRF + CORS
- `MIDDLEWARE`: Inclui CORS middleware
- `DATABASES`: SQLite (dev) / PostgreSQL (prod)
- `REST_FRAMEWORK`: Config DRF + autenticação JWT
- `CORS_ALLOWED_ORIGINS`: URLs frontend permitidas
- `JWT_*`: Configurações de tokens
- `GOOGLE_OAUTH_*`: Credenciais OAuth Google

#### **users/models.py**

Modelos de dados:

- `User`: Modelo customizado (substitui User padrão do Django)
  - Email como identificador único
  - Campos OAuth (google_id, discord_id)
  - Roles (client, booster, admin)
- `BoosterProfile`: Perfil adicional para boosters
  - Estatísticas (rating, completed_orders)
  - Financeiro (balance, pending_balance)

#### **authentication/views.py**

Endpoints da API:

- `google_oauth()`: Login OAuth Google
- `discord_oauth()`: Login Discord (futuro)
- `token_refresh()`: Renovar access token
- `me()`: Dados do usuário atual
- `logout()`: Logout

#### **authentication/jwt_utils.py**

Funções JWT:

- `generate_tokens()`: Gera access + refresh tokens
- `decode_token()`: Decodifica e valida token
- `verify_refresh_token()`: Valida refresh token

#### **authentication/authentication.py**

Classe de autenticação customizada:

- `JWTAuthentication`: Autentica requisições via JWT
- Espera header: `Authorization: Bearer <token>`

---

## 🗄️ **Modelos de Dados**

### **User Model**

```python
class User(AbstractBaseUser, PermissionsMixin):
    # Identificação
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    avatar = models.URLField(blank=True, null=True)

    # OAuth
    google_id = models.CharField(max_length=255, unique=True, null=True)
    discord_id = models.CharField(max_length=255, unique=True, null=True)

    # Papel
    role = models.CharField(
        max_length=10,
        choices=[('client', 'Cliente'), ('booster', 'Booster'), ('admin', 'Admin')],
        default='client'
    )

    # Flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
```

**Campos importantes:**

- `email`: Identificador único (usado para login)
- `google_id`: ID do usuário no Google (vem do OAuth)
- `role`: Define permissões (client, booster, admin)
- `is_verified`: Se email foi verificado (vem do Google)

### **BoosterProfile Model**

```python
class BoosterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Estatísticas
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    completed_orders = models.IntegerField(default=0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Financeiro
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pending_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Status
    verified = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)
    bio = models.TextField(blank=True, null=True)
```

**Quando é criado:**

- Automaticamente quando `User.role = 'booster'`
- Ou manualmente via Django Admin

---

## 🔌 **Endpoints da API**

Base URL: `http://localhost:8000/api/auth/`

### **POST /api/auth/google/**

Login via Google OAuth 2.0

**Request:**

```json
{
  "code": "4/0AY0e-...",
  "redirect_uri": "http://localhost:5173/auth/callback"
}
```

**Response (200 OK):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "name": "Nome do Usuário",
    "avatar": "https://...",
    "role": "client",
    "is_verified": true,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

**Erros:**

- `400 Bad Request`: Código OAuth inválido
- `400 Bad Request`: Client ID/Secret incorreto

---

### **POST /api/auth/refresh/**

Renova access token usando refresh token

**Request:**

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**

```json
{
  "user": { ... },
  "token": "novo_access_token",
  "refreshToken": "novo_refresh_token",
  "expiresIn": 3600
}
```

**Erros:**

- `401 Unauthorized`: Refresh token inválido ou expirado

---

### **GET /api/auth/me/**

Retorna dados do usuário autenticado

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "email": "user@gmail.com",
  "name": "Nome do Usuário",
  "avatar": "https://...",
  "role": "client",
  "booster_profile": null
}
```

**Erros:**

- `401 Unauthorized`: Token ausente, inválido ou expirado

---

### **POST /api/auth/logout/**

Logout (apenas retorna sucesso, JWT é stateless)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### **POST /api/auth/discord/**

Login via Discord OAuth (não implementado)

**Response (501 Not Implemented):**

```json
{
  "error": true,
  "message": "Login com Discord será implementado em breve",
  "code": "NOT_IMPLEMENTED"
}
```

---

## 🔐 **Sistema de Autenticação**

### **JWT (JSON Web Tokens)**

O sistema usa 2 tipos de tokens:

#### **1. Access Token**

- **Duração:** 1 hora
- **Uso:** Autenticar requisições à API
- **Formato:** `Bearer <token>`
- **Payload:**

```json
{
  "user_id": "uuid",
  "email": "user@gmail.com",
  "role": "client",
  "exp": 1234567890,
  "iat": 1234567890,
  "type": "access"
}
```

#### **2. Refresh Token**

- **Duração:** 7 dias
- **Uso:** Renovar access token quando expira
- **Armazenamento:** localStorage no frontend
- **Payload:**

```json
{
  "user_id": "uuid",
  "exp": 1234567890,
  "iat": 1234567890,
  "type": "refresh"
}
```

### **Autenticação de requisições**

Todas as requisições autenticadas devem incluir:

```http
GET /api/auth/me/ HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Se token for inválido/expirado:

```json
{
  "error": true,
  "message": "Token expirado",
  "details": null
}
```

---

## 🔄 **Fluxo OAuth Completo**

### **Diagrama de sequência:**

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌────────┐
│ Usuario │         │ Frontend │         │ Backend │         │ Google │
└────┬────┘         └────┬─────┘         └────┬────┘         └───┬────┘
     │                   │                    │                   │
     │ 1. Clica "Login"  │                    │                   │
     ├──────────────────>│                    │                   │
     │                   │                    │                   │
     │                   │ 2. loginWithGoogle()                   │
     │                   │────────────────────────────────────────>│
     │                   │                    │                   │
     │                   │          3. Tela de autorização        │
     │                   │<────────────────────────────────────────┤
     │                   │                    │                   │
     │ 4. Autoriza       │                    │                   │
     ├──────────────────>│                    │                   │
     │                   │                    │                   │
     │                   │ 5. Redirect com code                   │
     │                   │<────────────────────────────────────────┤
     │                   │                    │                   │
     │                   │ 6. POST /api/auth/google/ {code}       │
     │                   │───────────────────>│                   │
     │                   │                    │                   │
     │                   │                    │ 7. Valida code    │
     │                   │                    │──────────────────>│
     │                   │                    │                   │
     │                   │                    │ 8. User data      │
     │                   │                    │<──────────────────┤
     │                   │                    │                   │
     │                   │                    │ 9. Cria/atualiza  │
     │                   │                    │    User no DB     │
     │                   │                    │                   │
     │                   │                    │ 10. Gera JWT      │
     │                   │                    │                   │
     │                   │ 11. {user, token, refreshToken}        │
     │                   │<───────────────────┤                   │
     │                   │                    │                   │
     │                   │ 12. Salva no       │                   │
     │                   │     localStorage   │                   │
     │                   │                    │                   │
     │ 13. Usuário logado│                    │                   │
     │<──────────────────┤                    │                   │
```

### **Passo a passo detalhado:**

1. **Usuário clica em "Continuar com Google"**
   - Frontend chama `authStore.loginWithGoogle()`

2. **Frontend redireciona para Google**

   ```
   https://accounts.google.com/o/oauth2/v2/auth?
     client_id=...&
     redirect_uri=http://localhost:5173/auth/callback&
     response_type=code&
     scope=openid email profile&
     access_type=offline&
     prompt=select_account
   ```

3. **Google mostra tela de autorização**
   - Usuário seleciona conta Google
   - Autoriza acesso (email, perfil)

4. **Google redireciona de volta**

   ```
   http://localhost:5173/auth/callback?code=4/0AY0e-g5...
   ```

5. **Frontend captura o code**
   - `AuthCallbackView.vue` lê `route.query.code`
   - Chama `authStore.handleOAuthCallback('google', code)`

6. **Frontend envia code para backend**

   ```http
   POST http://localhost:8000/api/auth/google/
   Content-Type: application/json

   {
     "code": "4/0AY0e-g5...",
     "redirect_uri": "http://localhost:5173/auth/callback"
   }
   ```

7. **Backend valida code com Google**

   ```python
   # authentication/views.py
   flow = Flow.from_client_config(...)
   flow.fetch_token(code=code)
   credentials = flow.credentials
   id_info = id_token.verify_oauth2_token(...)
   ```

8. **Google retorna dados do usuário**

   ```json
   {
     "sub": "103845792834756",
     "email": "user@gmail.com",
     "name": "Nome do Usuário",
     "picture": "https://...",
     "email_verified": true
   }
   ```

9. **Backend cria/atualiza User no banco**

   ```python
   # Busca por google_id
   user = User.objects.get(google_id=google_id)
   # Se não encontrar, busca por email
   # Se não encontrar, cria novo
   ```

10. **Backend gera JWT tokens**

    ```python
    tokens = generate_tokens(user)
    # {
    #   'token': 'access_token...',
    #   'refreshToken': 'refresh_token...',
    #   'expiresIn': 3600
    # }
    ```

11. **Backend retorna resposta**

    ```json
    {
      "user": { ... },
      "token": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 3600
    }
    ```

12. **Frontend salva no localStorage**

    ```javascript
    // Pinia com plugin persistedstate faz automaticamente
    authStore.user = data.user
    authStore.token = data.token
    authStore.refreshToken = data.refreshToken
    ```

13. **Usuário está logado!**
    - Modal fecha
    - Header mostra nome
    - `authStore.isAuthenticated === true`

---

## ⚙️ **Variáveis de Ambiente**

Arquivo: `.env` (na raiz do backend)

```env
# ============================================
# DJANGO
# ============================================
SECRET_KEY=django-insecure-CHANGE-IN-PRODUCTION
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# ============================================
# CORS
# ============================================
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# ============================================
# JWT
# ============================================
JWT_SECRET_KEY=your-super-secret-jwt-key-CHANGE-THIS

# ============================================
# GOOGLE OAUTH
# ============================================
GOOGLE_OAUTH_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-abcdefghijk
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback

# ============================================
# DISCORD OAUTH (FUTURO)
# ============================================
DISCORD_OAUTH_CLIENT_ID=
DISCORD_OAUTH_CLIENT_SECRET=
DISCORD_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
```

### **Como obter as credenciais:**

#### **Google OAuth:**

1. Acesse: https://console.cloud.google.com/
2. Crie projeto ou selecione existente
3. Vá em "APIs e Serviços" → "Credenciais"
4. Crie "ID do cliente OAuth 2.0"
5. Tipo: "Aplicativo da Web"
6. URIs autorizados:
   - Origem: `http://localhost:5173`
   - Redirecionamento: `http://localhost:5173/auth/callback`
7. Copie **Client ID** e **Client Secret**

---

## 🚀 **Instalação e Configuração**

### **Pré-requisitos:**

- Python 3.10 ou superior
- pip (gerenciador de pacotes Python)
- Git

### **Passo a passo:**

```bash
# 1. Clone o repositório (ou baixe os arquivos)
git clone <repo-url>
cd lol-boost-backend

# 2. Crie ambiente virtual
python -m venv venv

# 3. Ative o ambiente virtual
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 4. Instale dependências
pip install -r requirements.txt

# 5. Configure variáveis de ambiente
cp .env.example .env
# Edite .env e preencha as credenciais

# 6. Rode migrations
python manage.py makemigrations
python manage.py migrate

# 7. (Opcional) Crie superusuário
python manage.py createsuperuser

# 8. Rode servidor
python manage.py runserver
```

Servidor rodará em: `http://127.0.0.1:8000/`

---

## 💻 **Comandos Úteis**

### **Desenvolvimento:**

```bash
# Rodar servidor
python manage.py runserver

# Rodar em porta diferente
python manage.py runserver 8080

# Rodar migrations
python manage.py makemigrations
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Shell interativo
python manage.py shell

# Criar app Django
python manage.py startapp nome_do_app
```

### **Banco de dados:**

```bash
# Ver SQL das migrations
python manage.py sqlmigrate users 0001

# Reverter migration
python manage.py migrate users 0001

# Resetar banco (CUIDADO!)
rm db.sqlite3
python manage.py migrate

# Abrir shell do banco
python manage.py dbshell
```

### **Testes:**

```bash
# Rodar todos os testes
python manage.py test

# Rodar testes de um app
python manage.py test authentication

# Coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### **Produção:**

```bash
# Coletar arquivos estáticos
python manage.py collectstatic

# Verificar deploy
python manage.py check --deploy

# Criar dump do banco
python manage.py dumpdata > backup.json

# Carregar dump
python manage.py loaddata backup.json
```

---

## 🐛 **Troubleshooting**

### **Erro: `ModuleNotFoundError: No module named 'decouple'`**

```bash
pip install python-decouple
```

### **Erro: `No such table: users_user`**

```bash
python manage.py makemigrations
python manage.py migrate
```

### **Erro: `CORS policy: No 'Access-Control-Allow-Origin'`**

Verifique `CORS_ALLOWED_ORIGINS` no `.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### **Erro: `UNIQUE constraint failed: users_user.email`**

Usuário já existe no banco. Opções:

**Opção 1 - Resetar banco:**

```bash
rm db.sqlite3
python manage.py migrate
```

**Opção 2 - Deletar usuário:**

```bash
python manage.py shell
```

```python
from users.models import User
User.objects.filter(email='seu@email.com').delete()
exit()
```

### **Erro: `invalid_grant` no OAuth**

- `GOOGLE_OAUTH_CLIENT_SECRET` incorreto
- Copie novamente do Google Cloud Console

### **Erro: `redirect_uri_mismatch`**

- URIs devem ser **exatamente iguais**:
  - Frontend `.env`: `VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback`
  - Backend `.env`: `GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback`
  - Google Cloud Console: `http://localhost:5173/auth/callback`

### **Erro: Token inválido nas requisições**

```bash
# Limpe o localStorage no navegador
# F12 > Application > Local Storage > Clear

# Ou rode no console do navegador:
localStorage.clear()
```

### **Erro: Django Admin não carrega CSS**

```bash
python manage.py collectstatic
```

---

## 📊 **Próximas Implementações**

### **Apps a serem criados:**

1. **`services`** - Serviços de boost
   - Models: Service, ServicePrice, ServiceCategory
   - Endpoints: CRUD de serviços
   - Admin: Gerenciar serviços

2. **`orders`** - Pedidos
   - Models: Order, OrderItem, OrderStatus
   - Endpoints: Criar, listar, atualizar pedidos
   - Permissões: Client cria, Booster vê, Admin gerencia

3. **`payments`** - Pagamentos
   - Integração: Mercado Pago
   - Models: Payment, Transaction
   - Webhooks: Notificações de pagamento

4. **`chat`** - Chat em tempo real
   - WebSocket: Django Channels
   - Models: Conversation, Message
   - Real-time: Cliente ↔ Booster

5. **`notifications`** - Notificações
   - Models: Notification
   - Tipos: Email, Push, In-app
   - Eventos: Pedido criado, pagamento aprovado, etc

---

## 🔗 **Recursos Úteis**

- **Django Docs:** https://docs.djangoproject.com/
- **DRF Docs:** https://www.django-rest-framework.org/
- **Google OAuth 2.0:** https://developers.google.com/identity/protocols/oauth2
- **JWT.io:** https://jwt.io/ (decodificar tokens)
- **Django CORS:** https://github.com/adamchainz/django-cors-headers

---

## 📝 **Notas para Outras IAs**

### **Contexto do projeto:**

Este é um backend Django para uma plataforma de boost de League of Legends. Sistema de autenticação está 100% funcional com Google OAuth e JWT.

### **Padrões adotados:**

- **Autenticação:** JWT (stateless)
- **Serialização:** Django REST Framework
- **Banco:** SQLite (dev), PostgreSQL (prod futuro)
- **Versionamento API:** Sem versão por enquanto, futuro: `/api/v1/`

### **Convenções de código:**

- **Idioma:** Comentários em português, código em inglês
- **Naming:** snake_case para Python
- **Imports:** Ordem: stdlib → third-party → local
- **Docstrings:** Google style

### **Ao adicionar novos endpoints:**

1. Criar serializer em `app/serializers.py`
2. Criar view em `app/views.py`
3. Adicionar URL em `app/urls.py`
4. Documentar neste README

### **Ao criar novos apps:**

1. `python manage.py startapp nome_app`
2. Adicionar em `INSTALLED_APPS` no `settings.py`
3. Criar models → migrations → admin
4. Incluir URLs em `config/urls.py`

### **Testes:**

- Criar `tests/` em cada app
- Nomear arquivos: `test_*.py`
- Rodar: `python manage.py test`

---

## 📄 **Licença**

Este projeto é privado e proprietário.

---

## 👥 **Contato**

Para dúvidas ou sugestões sobre este backend, consulte a documentação ou entre em contato.

---

**Última atualização:** Janeiro 2025
**Versão do backend:** 1.0.0 (Auth completo)
**Status:** ✅ Produção-ready (autenticação)
