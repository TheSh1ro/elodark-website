# 🎮 Elojob Website - Documentação do Projeto

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Estrutura de Stores (Pinia)](#-estrutura-de-stores-pinia)
- [Estrutura Backend (Django)](#-estrutura-backend-django)
- [Fluxo de Dados](#-fluxo-de-dados)
- [Roadmap de Implementação](#-roadmap-de-implementação)
- [Dependências](#-dependências)
- [Configuração e Deploy](#-configuração-e-deploy)
- [Funcionalidades](#-funcionalidades)

---

## 🎯 Visão Geral

Plataforma de elojob para League of Legends com sistema completo de:

- Calculadora de preços dinâmica
- Sistema de pagamentos (Mercado Pago)
- Autenticação OAuth (Google + Discord)
- Chat em tempo real entre cliente e booster
- Dashboard para boosters
- Sistema de carteira e saques

---

## 🛠 Stack Tecnológica

### Frontend

- **Framework:** Vue.js 3 (Composition API)
- **State Management:** Pinia
- **Routing:** Vue Router
- **TypeScript:** Tipagem completa
- **Build:** Vite
- **Deploy:** Vercel / Netlify

### Backend

- **Framework:** Django + Django REST Framework
- **Autenticação:** OAuth (Google + Discord) + JWT
- **WebSocket:** Django Channels + Redis
- **Pagamentos:** Mercado Pago SDK
- **Database:** PostgreSQL
- **Deploy:** Railway / Render / VPS

### Integrações

- **Riot Games API:** Lista de campeões (cache 24h)
- **Mercado Pago:** Pagamentos PIX/Cartão/Boleto
- **Google OAuth:** Login social
- **Discord OAuth:** Login social (futuro)

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vue.js)                       │
├─────────────────────────────────────────────────────────────┤
│  Pinia Stores:                                               │
│  ├─ configStore ✅ (IMPLEMENTADO)                           │
│  ├─ authStore 🔴 (PRÓXIMO)                                  │
│  ├─ elojobStore 🔴 (PRÓXIMO)                                │
│  ├─ cartStore 🟡 (FASE 2)                                   │
│  ├─ orderStore 🟡 (FASE 2)                                  │
│  ├─ chatStore 🟢 (FASE 3)                                   │
│  └─ boosterStore 🟢 (FUTURO)                                │
└─────────────────────────────────────────────────────────────┘
                              ↕️ REST API / WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Django + DRF)                    │
├─────────────────────────────────────────────────────────────┤
│  Apps Django:                                                │
│  ├─ accounts (OAuth, User, Profile)                         │
│  ├─ services (Elojob, Pricing, Configuration)               │
│  ├─ orders (Order, OrderItem, Payment)                      │
│  ├─ chat (Message, Room - Django Channels)                  │
│  ├─ booster (BoosterProfile, ServiceAssignment, Wallet)     │
│  └─ payments (Mercado Pago integration)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Estrutura de Stores (Pinia)

### 1. **configStore** ✅ (IMPLEMENTADO)

**Responsabilidade:** Configurações e dados estáticos

**Estado:**

```typescript
{
  elosPricing: EloData[]           // Tabela de preços por elo
  multipliers: {                   // Multiplicadores de preço
    express: 1.3,
    badMMR: 1.25,
    specificChampions: 1.3,
    role: 1.0
  }
  settings: {                      // Configurações gerais
    maxElo: 7,
    baseDaysPerDivision: 0.5,
    expressTimeMultiplier: 0.6,
    cdnVersion: '13.12.1'
  }
  champions: Champion[]            // Cache de campeões (Riot API)
  loading: boolean
  error: string | null
}
```

**Ações principais:**

- `fetchChampions()` - Busca campeões da Riot API (cache 24h)
- `fetchConfig()` - Busca configurações do backend
- `fetchPricing()` - Busca tabela de preços
- `getChampionImageUrl(imageName)` - Gera URL da imagem

**Endpoints Django:**

```
GET /api/config/pricing/    → elosPricing
GET /api/config/settings/   → settings, multipliers
```

---

### 2. **authStore** 🔴 (PRÓXIMO)

**Responsabilidade:** Autenticação e gerenciamento de usuário

**Estado:**

```typescript
{
  user: {
    id: string
    email: string
    name: string
    avatar: string
    role: 'client' | 'booster' | 'admin'
  } | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}
```

**Ações principais:**

- `loginWithGoogle()` - Abre popup OAuth Google
- `loginWithDiscord()` - Abre popup OAuth Discord (futuro)
- `logout()` - Limpa token e redireciona
- `checkAuth()` - Valida token ao carregar app
- `refreshToken()` - Renova token expirado

**Persistência:** ✅ localStorage (pinia-plugin-persistedstate)

**Endpoints Django:**

```
POST /api/auth/google/      → Login OAuth Google
POST /api/auth/discord/     → Login OAuth Discord (futuro)
GET  /api/auth/me/          → Dados do usuário atual
POST /api/auth/refresh/     → Renovar token JWT
POST /api/auth/logout/      → Invalidar token
```

**Guards de Rota:**

```typescript
// Em router/index.ts
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

---

### 3. **elojobStore** 🔴 (PRÓXIMO)

**Responsabilidade:** Estado da calculadora de elojob

**Estado:**

```typescript
{
  currentElo: number | null
  currentDivision: number | null
  targetElo: number | null
  targetDivision: number | null
  queue: 'solo' | 'flex'
  options: {
    express: boolean
    badMMR: boolean
    specificChampions: boolean
    role: boolean
  }
  selectedRoles: RoleId[]
  selectedChampions: Champion[]
}
```

**Getters:**

- `isConfigured` - Se a calculadora está completa
- `divisions` - Número total de divisões
- `basePrice` - Preço sem multiplicadores
- `finalPrice` - Preço final com multiplicadores
- `estimatedTime` - Tempo estimado (ex: "2-4 dias")
- `currentEloLabel` - Label formatada (ex: "Prata II")
- `targetEloLabel` - Label formatada (ex: "Ouro IV")
- `serviceData` - Objeto completo para enviar ao carrinho

**Ações principais:**

- `setCurrentElo(elo, division)`
- `setTargetElo(elo, division)`
- `toggleOption(optionKey)`
- `setQueue(queueType)`
- `reset()` - Limpar configuração

**Persistência:** ✅ localStorage (última configuração - UX)

---

### 4. **cartStore** 🟡 (FASE 2)

**Responsabilidade:** Carrinho de compras

**Estado:**

```typescript
{
  items: ServiceItem[]      // Serviços adicionados
  coupon: Coupon | null     // Cupom aplicado
  total: number             // Total calculado
}

interface ServiceItem {
  id: string
  type: 'elojob' | 'duoboost' | 'coaching'
  data: ServiceData
  price: number
  addedAt: string
}
```

**Ações principais:**

- `addService(serviceData)` - Adiciona do elojobStore
- `removeService(id)`
- `updateService(id, data)`
- `applyCoupon(code)` - Valida e aplica desconto
- `clearCart()`
- `checkout()` - Envia para orderStore

**Persistência:** ✅ localStorage (24h)

**Endpoints Django:**

```
GET /api/coupons/:code/validate/    → Validar cupom
```

---

### 5. **orderStore** 🟡 (FASE 2)

**Responsabilidade:** Pedidos do usuário

**Estado:**

```typescript
{
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
}

interface Order {
  id: string
  status: 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled'
  service: ServiceData
  payment: {
    method: 'pix' | 'credit_card' | 'boleto'
    status: 'pending' | 'approved' | 'rejected'
    amount: number
    mercadoPagoId: string
  }
  booster: {
    id: string
    name: string
    avatar: string
  } | null
  chat: {
    roomId: string
    unreadCount: number
  }
  createdAt: string
  updatedAt: string
  completedAt: string | null
}
```

**Ações principais:**

- `createOrder(cartData)` - Cria pedido + inicia pagamento
- `fetchOrders()` - Lista todos os pedidos
- `fetchOrder(id)` - Detalhes de um pedido
- `cancelOrder(id)` - Cancela pedido (se permitido)
- `trackOrder(id)` - Polling de status

**Endpoints Django:**

```
POST /api/orders/                → Criar pedido
GET  /api/orders/                → Listar pedidos do usuário
GET  /api/orders/:id/            → Detalhes do pedido
POST /api/orders/:id/cancel/     → Cancelar pedido
GET  /api/orders/:id/status/     → Status atual (polling)
```

---

### 6. **chatStore** 🟢 (FASE 3)

**Responsabilidade:** Chat em tempo real

**Estado:**

```typescript
{
  rooms: Map<string, Message[]> // Mensagens por sala
  activeRoom: string | null // Sala ativa
  connection: WebSocket | null // Conexão WS
  typing: Map<string, boolean> // Quem está digitando
}

interface Message {
  id: string
  roomId: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  files: File[]
  timestamp: string
  read: boolean
}
```

**Ações principais:**

- `connectRoom(orderId)` - Conecta WebSocket
- `sendMessage(text, files?)`
- `markAsRead(roomId)`
- `setTyping(isTyping)`
- `disconnect()`

**WebSocket (Django Channels):**

```
WS /ws/chat/:orderId/    → Conexão WebSocket
```

**Endpoints REST (backup):**

```
POST /api/chat/:orderId/messages/    → Enviar mensagem
GET  /api/chat/:orderId/messages/    → Histórico
PUT  /api/chat/:orderId/read/        → Marcar como lido
```

---

### 7. **boosterStore** 🟢 (FUTURO)

**Responsabilidade:** Dashboard do booster

**Estado:**

```typescript
{
  profile: BoosterProfile
  availableServices: Service[]    // Serviços disponíveis para pegar
  myServices: Service[]           // Serviços em andamento
  wallet: {
    balance: number               // Saldo disponível
    pending: number               // Saldo pendente
    nextWithdrawal: string        // Próxima data de saque
  }
  stats: {
    completed: number
    rating: number
    successRate: number
  }
}
```

**Ações principais:**

- `fetchAvailableServices()` - Serviços pendentes
- `fetchMyServices()` - Meus serviços
- `claimService(serviceId)` - Pegar serviço
- `completeService(serviceId)` - Marcar como concluído
- `giveUpService(serviceId)` - Desistir do serviço
- `requestWithdrawal()` - Solicitar saque

**Endpoints Django:**

```
GET  /api/booster/services/available/    → Serviços disponíveis
GET  /api/booster/services/mine/         → Meus serviços
POST /api/booster/services/:id/claim/    → Pegar serviço
POST /api/booster/services/:id/complete/ → Concluir serviço
POST /api/booster/services/:id/giveup/   → Desistir
GET  /api/booster/wallet/                → Saldo
POST /api/booster/wallet/withdraw/       → Solicitar saque
GET  /api/booster/stats/                 → Estatísticas
```

---

## 🐍 Estrutura Backend (Django)

```
my_project/
├─ manage.py
├─ requirements.txt
├─ .env
│
├─ config/                 # Configurações do projeto
│  ├─ settings.py
│  ├─ urls.py
│  ├─ asgi.py             # WebSocket
│  └─ wsgi.py
│
├─ accounts/              # Autenticação
│  ├─ models.py
│  │  ├─ User (Django default)
│  │  └─ Profile (role, avatar, etc)
│  ├─ serializers.py
│  ├─ views.py
│  │  ├─ GoogleLoginView
│  │  ├─ DiscordLoginView
│  │  └─ UserProfileView
│  └─ urls.py
│
├─ services/              # Elojob, Pricing
│  ├─ models.py
│  │  ├─ Elo
│  │  ├─ PricingRule
│  │  ├─ Multiplier
│  │  └─ Champion (cache)
│  ├─ serializers.py
│  ├─ views.py
│  │  ├─ PricingListView
│  │  └─ ConfigView
│  └─ admin.py           # Admin customizado
│
├─ orders/                # Pedidos
│  ├─ models.py
│  │  ├─ Order
│  │  ├─ OrderItem
│  │  └─ Payment
│  ├─ serializers.py
│  ├─ views.py
│  │  ├─ OrderCreateView
│  │  ├─ OrderListView
│  │  └─ OrderDetailView
│  └─ signals.py         # Notificações
│
├─ payments/              # Mercado Pago
│  ├─ models.py
│  │  └─ Transaction
│  ├─ services.py
│  │  └─ MercadoPagoService
│  ├─ webhooks.py        # Notificações MP
│  └─ urls.py
│
├─ chat/                  # Django Channels
│  ├─ models.py
│  │  ├─ Room
│  │  └─ Message
│  ├─ consumers.py       # WebSocket consumer
│  ├─ routing.py         # WebSocket routing
│  └─ serializers.py
│
└─ booster/               # Dashboard booster
   ├─ models.py
   │  ├─ BoosterProfile
   │  ├─ ServiceAssignment
   │  └─ Wallet
   ├─ serializers.py
   ├─ views.py
   │  ├─ AvailableServicesView
   │  ├─ ClaimServiceView
   │  └─ WalletView
   └─ tasks.py           # Celery tasks (saques)
```

### Modelos principais

#### **accounts/models.py**

```python
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=10,
        choices=[('client', 'Client'), ('booster', 'Booster'), ('admin', 'Admin')],
        default='client'
    )
    avatar = models.URLField(blank=True)
    discord_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

#### **orders/models.py**

```python
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('paid', 'Paid'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    service_data = models.JSONField()  # Dados do elojobStore
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    booster = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='boosted_orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True)
```

---

## 🔄 Fluxo de Dados

### Fluxo completo de compra:

```
1. Usuário entra no site
   ↓
2. configStore.initialize() carrega:
   - Tabela de preços do Django
   - Campeões da Riot API (cache 24h)
   ↓
3. Usuário configura elojob na calculadora
   - elojobStore armazena seleção
   - Cálculos de preço/tempo em tempo real
   ↓
4. Clica "Contratar"
   ↓
5. authStore verifica autenticação
   - Não logado? → Redireciona para /login
   - Logado? → Continua
   ↓
6. cartStore.addService(elojobStore.serviceData)
   - Adiciona ao carrinho
   - Persiste em localStorage
   ↓
7. Redireciona para /checkout
   - Mostra resumo
   - Permite aplicar cupom
   - Escolhe método de pagamento
   ↓
8. orderStore.createOrder(cartData)
   POST /api/orders/
   - Django cria Order
   - Integra Mercado Pago
   - Retorna link de pagamento
   ↓
9. Usuário paga (PIX/Cartão/Boleto)
   ↓
10. Webhook Mercado Pago notifica Django
    POST /api/payments/webhook/
    - Atualiza Order.status = 'paid'
    - Notifica usuário
    ↓
11. Redireciona para /orders/:id
    - Mostra status
    - Aguarda booster
    ↓
12. Booster pega o serviço
    POST /api/booster/services/:id/claim/
    - Vincula booster ao pedido
    - Order.status = 'in_progress'
    ↓
13. Chat fica disponível
    WS /ws/chat/:orderId/
    - Cliente e booster podem conversar
    - Upload de prints
    ↓
14. Booster completa
    POST /api/booster/services/:id/complete/
    - Order.status = 'completed'
    - Saldo adicionado à carteira
    ↓
15. Cliente avalia (futuro)
    POST /api/orders/:id/review/
```

---

## 🚀 Roadmap de Implementação

### **Fase 1: MVP (4-6 semanas)** 🔴

#### Semana 1-2: Backend Base + OAuth

- [ ] Setup Django projeto
- [ ] Configurar PostgreSQL
- [ ] App `accounts` + OAuth Google
- [ ] JWT authentication
- [ ] `authStore.ts` no frontend
- [ ] Tela de login funcional

#### Semana 3-4: Calculadora + Checkout

- [ ] App `services` (Pricing, Config)
- [ ] Migrar dados hardcoded para Django
- [ ] `elojobStore.ts`
- [ ] `cartStore.ts`
- [ ] App `orders` (Order, Payment)
- [ ] Integração Mercado Pago básica
- [ ] Fluxo de checkout completo

#### Semana 5-6: Área do Cliente

- [ ] `orderStore.ts`
- [ ] Listagem de pedidos
- [ ] Detalhes do pedido
- [ ] Status tracking (polling)
- [ ] Cancelamento de pedido

**Entregável Fase 1:** Cliente pode configurar elojob, pagar e acompanhar pedido.

---

### **Fase 2: Chat Real-time (2-3 semanas)** 🟡

#### Semana 7-8: WebSocket

- [ ] Configurar Django Channels + Redis
- [ ] App `chat` (Room, Message)
- [ ] WebSocket consumer
- [ ] `chatStore.ts`
- [ ] Interface de chat

#### Semana 9: Melhorias

- [ ] Upload de arquivos no chat
- [ ] Notificações de mensagem
- [ ] Indicador "digitando..."
- [ ] Histórico de mensagens

**Entregável Fase 2:** Cliente e booster podem conversar em tempo real.

---

### **Fase 3: Dashboard Booster (3-4 semanas)** 🟢

#### Semana 10-11: Sistema de Serviços

- [ ] App `booster` (Profile, Assignment, Wallet)
- [ ] Listagem de serviços disponíveis
- [ ] Sistema de claim (pegar serviço)
- [ ] Marcar como concluído
- [ ] Desistir de serviço

#### Semana 12-13: Sistema de Pagamentos

- [ ] Carteira do booster
- [ ] Saldo disponível/pendente
- [ ] Datas fixas de saque (1º e 15º)
- [ ] Histórico de transações
- [ ] `boosterStore.ts`

**Entregável Fase 3:** Booster pode pegar serviços, concluir e receber pagamento.

---

### **Fase 4: Melhorias e Escala (ongoing)** 🟢

- [ ] App mobile para booster (React Native / Flutter)
- [ ] OAuth Discord
- [ ] Sistema de avaliações
- [ ] Dashboard admin completo
- [ ] Analytics e métricas
- [ ] Sistema de notificações push
- [ ] Cupons de desconto
- [ ] Programa de afiliados

---

## 📦 Dependências

### Frontend (package.json)

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "pinia-plugin-persistedstate": "^3.2.0",
    "@vueuse/core": "^10.7.0",
    "socket.io-client": "^4.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### Backend (requirements.txt)

```txt
# Core
Django==5.0
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1

# OAuth
dj-rest-auth==5.0.2
django-allauth==0.57.0

# WebSocket
channels==4.0.0
channels-redis==4.1.0
redis==5.0.1

# Pagamentos
mercadopago==2.2.1

# Database
psycopg2-binary==2.9.9

# Utilities
django-cors-headers==4.3.1
python-decouple==3.8
Pillow==10.1.0

# Celery (futuro)
celery==5.3.4
django-celery-beat==2.5.0
```

---

## ⚙️ Configuração e Deploy

### Variáveis de Ambiente

#### **Frontend (.env)**

```bash
VITE_API_BASE_URL=https://api.seusite.com
VITE_WS_URL=wss://api.seusite.com/ws
VITE_GOOGLE_CLIENT_ID=seu_client_id
VITE_MERCADOPAGO_PUBLIC_KEY=sua_public_key
```

#### **Backend (.env)**

```bash
# Django
SECRET_KEY=sua_secret_key_aqui
DEBUG=False
ALLOWED_HOSTS=api.seusite.com,localhost

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# OAuth
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_secret
DISCORD_CLIENT_ID=seu_discord_client_id
DISCORD_CLIENT_SECRET=seu_discord_secret

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_access_token
MERCADOPAGO_PUBLIC_KEY=sua_public_key

# Redis (WebSocket)
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=https://seusite.com,http://localhost:5173
```

### Deploy Sugerido

#### **Frontend (Vercel)**

```bash
# Conectar repositório GitHub
# Build Command: npm run build
# Output Directory: dist
# Environment Variables: adicionar .env
```

#### **Backend (Railway / Render)**

```bash
# Conectar repositório GitHub
# Start Command: gunicorn config.wsgi:application
# Environment Variables: adicionar .env
# PostgreSQL: Railway Addon
# Redis: Railway Addon
```

---

## ✨ Funcionalidades

### Para Clientes

- [x] Calculadora de elojob dinâmica
- [x] Seleção de campeões específicos
- [x] Seleção de roles
- [x] Opções extras (express, MMR ruim, etc)
- [ ] Login com Google
- [ ] Login com Discord (futuro)
- [ ] Carrinho de compras
- [ ] Aplicar cupons de desconto
- [ ] Pagamento via Mercado Pago (PIX/Cartão/Boleto)
- [ ] Acompanhar status do pedido
- [ ] Chat com booster
- [ ] Histórico de pedidos
- [ ] Avaliar booster (futuro)

### Para Boosters

- [ ] Dashboard de serviços disponíveis
- [ ] Pegar serviços (claim)
- [ ] Chat com cliente
- [ ] Marcar serviço como concluído
- [ ] Desistir de serviço
- [ ] Carteira (saldo disponível/pendente)
- [ ] Solicitar saque (1º e 15º do mês)
- [ ] Histórico de transações
- [ ] Estatísticas (rating, taxa de sucesso)
- [ ] App mobile (futuro)

### Para Admins

- [ ] Dashboard completo
- [ ] Gerenciar preços
- [ ] Gerenciar multiplicadores
- [ ] Gerenciar cupons
- [ ] Aprovar saques de boosters
- [ ] Gerenciar usuários
- [ ] Analytics e métricas
- [ ] Sistema de notificações

---

## 📊 Status Atual

### ✅ Implementado

- `configStore.ts` - Completo com cache de campeões
- `ElojobCalculator.vue` - Refatorado para usar store
- `ChampionPickerModal.vue` - Refatorado para usar store
- Estrutura de pastas Vue.js
- TypeScript configurado

### 🔴 Em Desenvolvimento

- `authStore.ts` - OAuth Google
- Backend Django setup
- Integração Mercado Pago

### 🟡 Planejado

- `elojobStore.ts`
- `cartStore.ts`
- `orderStore.ts`
- Sistema de chat
- Dashboard booster

---
