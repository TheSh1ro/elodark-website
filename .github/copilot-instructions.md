# Instruções para Agentes de IA - ELO Job Website

## Visão Geral do Projeto

**elojob-website** é um site premium de boosting de Elo para jogadores de League of Legends. Stack: Vue 3 + TypeScript + Vite.

### 🔄 Contexto de Migração

Este projeto está em **transição de Vanilla JS para Vue 3**. A pasta `old/` contém o código anterior:

- **Tecnologia anterior**: HTML + Vanilla JS + CSS puro
- **Código legado**: `old/{index.html, main.js, styles.css, animations.js, background.js}`
- **Abordagem**: DOM manipulation direta, event listeners globais, zero state management
- **Status**: Migração em progresso - reutilizar patterns visuais/lógicos, mas refatorar para Vue Composition API

**Padrões sendo migratos**:

- ✅ Sistema de cores e temas CSS (preservado em `:root`)
- ✅ Estrutura de seções (hero, carousel, about, packages, testimonials)
- ✅ Scroll-based animations e effects
- ✅ 3D canvas background, scanlines, glitch effects
- ❌ DOM manipulation direta (agora: refs + reactivity)
- ❌ Event listeners globais (agora: component lifecycle)

### Arquitetura de Alto Nível

```
App.vue (root com particle effects, header/footer fixos)
  ├── PageHeader (nav sticky com scroll suave)
  ├── RouterView (HomeView apenas, por enquanto)
  │   └── HomeView (composição de seções)
  │       ├── HeroSection (hero + stats bar)
  │       ├── CarersCarousel (carousel de boosters com drag/autoplay)
  │       ├── AboutComponent
  │       ├── PackagesComponent
  │       └── TestimonialsComponent
  └── PageFooter
```

**Dados globais**: Pinia store (`stores/counter.ts`) - simples, mas padrão implementado.

---

## Padrões Técnicos

### 1. **Estilo e Tema**

- **Cores CSS customizadas** em `App.vue` (`:root`):
  - `--primary: #4cba9d` (teal)
  - `--secondary: #00fff5` (cyan)
  - `--dark: #0a0e1a` (background)
  - `--darker: #050810` (background mais escuro)
- **Fonte principal**: Rajdhani
- **Fonte premium**: Orbitron (títulos, números, badges)
- **Efeito visual**: Glitch text, particles ao mover mouse, scanlines
- **Cursor customizado**: SVG inline com glow verde

### 2. **Componentes Vue**

- Todos usam `<script setup lang="ts">` (Composition API + TypeScript)
- Padrão de refs: `ref<HTMLElement | null>(null)` para acesso ao DOM
- Lifecycle: `onMounted`, `onBeforeUnmount` para listeners
- Computed properties para cálculos reativos

### 3. **CarersCarousel - Padrão Complexo**

Exemplo de interatividade avançada:

- **Refs reativos**: `currentIndex`, `isDragging`, `startPos`
- **Computed**: `visibleCards` (responsive), `totalPages`, `offset`
- **Drag**: `dragStart`, `drag`, `dragEnd` com 50px threshold
- **Autoplay**: `setInterval` com cleanup em `onBeforeUnmount`
- **Listeners**: Mouse + Touch (múltiplos eventos simultâneos)
- **Transform CSS**: `translateX` com transition `cubic-bezier`

---

## Workflows de Desenvolvimento

### Build & Dev

```bash
npm run dev              # Vite dev server (HMR habilitado)
npm run build           # Type-check + vite build (produção)
npm run type-check      # vue-tsc --build (sem build)
npm run lint            # ESLint com --fix
npm run format          # Prettier (src/)
```

### Arquivos de Configuração

- `tsconfig.json` + `tsconfig.app.json`: TypeScript (Node 20+)
- `vite.config.ts`: Alias `@` → `./src`, plugins Vue + DevTools
- `eslint.config.ts` + Prettier: Formatação automática
- `.github/workflows/` ainda não configurado

---

## Convenções do Projeto

### 1. **Estrutura de Componentes**

```vue
<script setup lang="ts">
// 1. Imports
// 2. Refs (estado local)
// 3. Computed (cálculos)
// 4. Functions (handlers, effects)
// 5. onMounted/onBeforeUnmount (cleanup obrigatório)
</script>

<template>
  <!-- HTML estruturado semântico -->
</template>

<style scoped>
/* CSS segmentado: layout → componentes → responsive */
/* @media (max-width: 768px) @media (max-width: 480px) */
</style>
```

### 2. **Identificadores e IDs**

- Sections têm `id` para navegação (ex: `id="boosters"`, `id="home"`)
- Navegação usa scroll suave: `element.scrollIntoView({ behavior: 'smooth' })`
- Buttons com handler `@click` ou atributo `onclick` (ambos usados)

### 3. **Classes CSS**

- BEM-inspired: `.booster-card`, `.stat-item`, `.carousel-nav`
- Estados: `.active`, `.hover`, `.disabled`
- Sufixos semânticos: `-header`, `-body`, `-footer`, `-label`, `-value`

### 4. **Assets & Imagens**

- `src/assets/styles.css` (estilos globais compartilhados)
- Imagens podem ser URLs externas (ex: `pinimg.com`)
- Ícones: Font Awesome (classe `fas fa-*`)

---

## Pontos de Integração e Dependências

### Pinia (State Management)

```typescript
// stores/counter.ts - padrão, expandir conforme necessário
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  return { count }
})
```

**Use para**: Dados de boosters, carrinho, autenticação futura.

### Vue Router

```typescript
// router/index.ts - apenas rota home por enquanto
routes: [{ path: '/', name: 'home', component: HomeView }]
```

**Próximos passos**: Adicionar `/services`, `/boosters/:id`, `/checkout`.

### Vite DevTools

Habilitado em `vite.config.ts` - acesse pelo ícone no canto da página em dev.

---

## Patterns Específicos do Projeto

### 1. **Scroll-based Effects**

```typescript
// HeroSection: glitch animation ao scroll > 100px
const lastScroll = ref(0)
const handleScroll = () => {
  const currentScroll = window.pageYOffset
  if (Math.abs(currentScroll - lastScroll) > 100) {
    triggerAnimation()
  }
}
```

### 2. **DOM Manipulation Dinâmica**

```typescript
// App.vue: criação de particles ao mover mouse
const particle = document.createElement('div')
particle.style.opacity = '0'
setTimeout(() => particle.remove(), 600)
```

### 3. **Event Listeners com Cleanup**

```typescript
// OBRIGATÓRIO: remover listeners no unmount
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})
```

### 4. **Responsive Computed**

```typescript
// CarersCarousel: recalcula visible cards ao redimensionar
const visibleCards = computed(() => {
  const containerWidth = carouselWrapper.value?.offsetWidth || 1
  return Math.floor(containerWidth / cardWidth)
})
```

---

## Checklist para Novas Funcionalidades

- [ ] Usar `<script setup>` com TypeScript
- [ ] Adicionar `ref<HTMLElement | null>(null)` para acesso ao DOM
- [ ] **Limpar listeners** em `onBeforeUnmount`
- [ ] Usar `computed` para dados derivados
- [ ] Teste responsividade: mobile (480px), tablet (768px)
- [ ] Aplique tema de cores via CSS variables (`:root`)
- [ ] Documente IDs de sections para navegação
- [ ] Use `element.scrollIntoView()` para navegação internal
- [ ] Prefira Composition API + TypeScript

---

## Guia de Migração - Vanilla JS → Vue 3

### Referência: Código Legado (`old/`)

- `old/index.html`: Estrutura HTML monolítica com seções inline
- `old/main.js`: Event listeners globais com `DOMContentLoaded`
- `old/animations.js`: Animações com DOM manipulation e `requestAnimationFrame`
- `old/background.js`: Canvas 3D e particle effects imperativos
- `old/styles.css`: CSS puro (reutilizado no projeto Vue)

### Padrão de Migração

Ao converter componentes do `old/`, siga este fluxo:

1. **Extrair HTML** → component template
2. **Converter event listeners** → Vue directives (`@click`, `@scroll`)
3. **Refatorar DOM access** → Vue refs (`ref<HTMLElement | null>(null)`)
4. **Mover estado** → refs/computed/stores (em vez de variáveis globais)
5. **Preservar CSS** → copiar estilos com `scoped`, ajustar seletores
6. **Lifecycle** → `onMounted`, `onBeforeUnmount` (com cleanup obrigatório)

### Exemplo de Conversão

**Antes (Vanilla JS)**:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn')
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => handleClick(btn))
  })
})
```

**Depois (Vue 3)**:

```vue
<script setup lang="ts">
import { onMounted } from 'vue'

const handleClick = (element: HTMLElement) => {
  /* ... */
}

onMounted(() => {
  // Vue já rendeu - refs estão disponíveis
  const buttons = document.querySelectorAll('.btn')
  buttons.forEach((btn) => btn.addEventListener('click', () => handleClick(btn)))
})

// ⚠️ IMPORTANTE: Sempre limpar!
onBeforeUnmount(() => {
  // cleanup listeners
})
</script>
```

---

## Próximos Passos Sugeridos

1. **Completar migração** dos componentes restantes de `old/`
2. **Criar stores** para boosters, serviços, carrinho de compra
3. **Expandir router** com sub-rotas para detalhes de boosters
4. **Adicionar formulários** com validação
5. **SEO**: meta tags dinâmicas
6. **Analytics**: track conversões
7. **Autenticação**: login/checkout
8. **Remover `old/`** após migração completa
