# Guia de Estilos - ELO Job Website

Guia completo de padrões de estilo, cores e variáveis CSS para desenvolvimento e manutenção do site.

---

## 🎨 Sistema de Cores

### Variáveis CSS

Todas as cores são definidas no `:root` do `App.vue`:

```css
:root {
  --primary: #4cba9d; /* Teal - Cor principal */
  --secondary: #00fff5; /* Cyan Neon - Acentos e glow */
  --accent: #ff006e; /* Pink - Destaques secundários */
  --dark: #0a0e1a; /* Dark BG - Cards e seções */
  --darker: #050810; /* Darker BG - Fundo principal */
}
```

### Paleta Completa

| Variável      | Valor HEX | RGB            | Aplicação                         |
| ------------- | --------- | -------------- | --------------------------------- |
| `--primary`   | `#4cba9d` | `76, 186, 157` | Botões, links, bordas, destaques  |
| `--secondary` | `#00fff5` | `0, 255, 245`  | Efeitos neon, glow, acentos       |
| `--accent`    | `#ff006e` | `255, 0, 110`  | Badges, alertas, CTAs secundários |
| `--dark`      | `#0a0e1a` | `10, 14, 26`   | Background de cards e seções      |
| `--darker`    | `#050810` | `5, 8, 16`     | Background principal do body      |

**Cores adicionais:**

- Branco: `#fff` - Texto principal
- Cinza escuro: `#1a1f2e` - Dividers sutis

### Uso em Componentes

```vue
<style scoped>
/* ✅ CORRETO - Usar variáveis */
.button {
  background: var(--primary);
  border: 1px solid var(--secondary);
}

/* ❌ EVITAR - Valores hardcoded */
.button {
  background: #4cba9d;
}

/* Transparência e variações */
background: rgba(76, 186, 157, 0.1); /* Primary 10% */
background: linear-gradient(135deg, var(--primary), var(--secondary));
</style>
```

---

## 🔤 Tipografia

### Fontes

```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap');
```

### Rajdhani (Corpo e Conteúdo)

```css
body,
p,
span {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500; /* Padrão */
}

/* Pesos disponíveis: 300 (light), 500 (medium), 700 (bold) */
```

**Uso:** Texto corrido, descrições, parágrafos, labels.

### Orbitron (Títulos e Destaques)

```css
h1,
h2,
h3,
.badge {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700; /* Padrão para títulos */
  letter-spacing: 0.05em;
}

/* Pesos disponíveis: 400 (regular), 700 (bold), 900 (black) */
```

**Uso:** Títulos, números, badges, elementos premium.

### Hierarquia de Tamanhos

```css
h1 {
  font-size: 3.5rem;
  font-weight: 700;
} /* Títulos principais */
h2 {
  font-size: 2.5rem;
  font-weight: 700;
} /* Subtítulos */
h3 {
  font-size: 1.8rem;
  font-weight: 700;
} /* Seções */
p {
  font-size: 1rem;
  font-weight: 500;
} /* Corpo */
small {
  font-size: 0.875rem;
  font-weight: 300;
} /* Labels */
```

---

## ✨ Efeitos Visuais

### Glow Effects

```css
/* Glow básico */
.glow {
  box-shadow: 0 0 20px var(--primary);
}

/* Glow neon (duplo) */
.glow-neon {
  box-shadow:
    0 0 20px var(--secondary),
    0 0 40px rgba(0, 255, 245, 0.5);
}

/* Glow animado */
@keyframes glow-pulse {
  0%,
  100% {
    box-shadow: 0 0 20px var(--primary);
  }
  50% {
    box-shadow: 0 0 40px var(--primary);
  }
}

.glow-animated {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### Transições Padrão

```css
/* Transição padrão do projeto */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.smooth-transition-slow {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Scanlines (Efeito CRT)

```css
.scanlines {
  position: relative;
  overflow: hidden;
}

.scanlines::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 2px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
  z-index: 1;
}
```

**Scanline animado (global.css):**

```css
.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent 50%, rgba(76, 186, 157, 0.025) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 9999;
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
}
```

### Glitch Effect

```css
@keyframes glitch {
  0%,
  20%,
  60%,
  100% {
    text-shadow:
      -2px 0 var(--secondary),
      2px 0 var(--accent);
  }
  40%,
  80% {
    text-shadow:
      -2px 0 var(--accent),
      2px 0 var(--secondary);
  }
}

.glitch {
  animation: glitch 0.3s ease-in-out;
}
```

### Cursor Customizado

```css
body {
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%234cba9d" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%2300fff5"/></svg>')
      12 12,
    auto;
}
```

### Partículas (Mouse Trail)

Implementado em `App.vue` através da função `handleMouseMove`. Cria pequenas partículas que dissipam ao movimento do mouse.

---

## 🌍 Classes Globais (global.css)

### Section Title

```css
.section-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Uso:**

```vue
<h1 class="section-title">Boosters Premium</h1>
```

### Section Subtitle

```css
.section-subtitle {
  text-align: center;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 5rem;
  letter-spacing: 1px;
}
```

**Uso:**

```vue
<h1 class="section-title">Nossos Serviços</h1>
<p class="section-subtitle">Escolha o pacote perfeito para suas necessidades</p>
```

---

## 🧩 Padrões de Componentes

### Card

```vue
<style scoped>
.card {
  background: var(--dark);
  border: 1px solid rgba(76, 186, 157, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  background: rgba(76, 186, 157, 0.05);
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.2);
}

/* Card com destaque premium */
.card-featured {
  border: 2px solid var(--primary);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.2);
}
</style>
```

### Botões

```vue
<style scoped>
/* Botão primário */
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  box-shadow: 0 0 20px var(--primary);
  transform: translateY(-2px);
}

/* Botão secundário (outline) */
.btn-secondary {
  background: transparent;
  color: var(--secondary);
  border: 2px solid var(--secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: rgba(0, 255, 245, 0.1);
  box-shadow: 0 0 20px var(--secondary);
}
</style>
```

### Badge

```vue
<style scoped>
.badge {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-accent {
  background: var(--accent);
}
</style>
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Desktop: padrão, sem media query */

/* Tablet */
@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  h2 {
    font-size: 1.8rem;
  }
}

/* Mobile */
@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  h2 {
    font-size: 1.4rem;
  }

  .flex-row {
    flex-direction: column;
  }
}
```

### Grid Responsivo

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 🎯 Combinações Comuns

```css
/* Texto com glow neon */
.glowing-text {
  color: var(--secondary);
  text-shadow: 0 0 20px var(--secondary);
}

/* Gradiente premium */
.premium-gradient {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}

/* Seção com scanlines */
.section-featured {
  background: var(--dark);
  position: relative;
}

.section-featured::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 2px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
}
```

---

## 📐 Estrutura de Estilos

### Ordem em Componentes Vue

```vue
<style scoped>
/* 1. Layout (flexbox, grid, positioning) */
.container {
  display: flex;
  justify-content: space-between;
}

/* 2. Componentes (cards, buttons, badges) */
.card {
  background: var(--dark);
}

/* 3. Estados (hover, active, disabled) */
.card:hover {
  background: rgba(76, 186, 157, 0.05);
}

/* 4. Responsividade (media queries no final) */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
</style>
```

---

## ✅ Checklist para Novos Componentes

- [ ] Usar variáveis CSS (`:root`) para todas as cores
- [ ] Aplicar tipografia correta (Rajdhani corpo, Orbitron títulos)
- [ ] Incluir transições suaves (`cubic-bezier(0.4, 0, 0.2, 1)`)
- [ ] Adicionar estados hover/active com feedback visual
- [ ] Implementar responsividade (breakpoints 480px, 768px)
- [ ] Respeitar hierarquia de tamanhos de fonte
- [ ] Usar `scoped` styles em componentes Vue
- [ ] Validar acessibilidade (contraste mínimo de cores)

---

## 🚀 Quick Reference

```css
/* Cores */
--primary: #4cba9d;
--secondary: #00fff5;
--accent: #ff006e;
--dark: #0a0e1a;
--darker: #050810;

/* Tipografia */
font-family: 'Rajdhani', sans-serif; /* Corpo */
font-family: 'Orbitron', sans-serif; /* Títulos */

/* Transição padrão */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Glow padrão */
box-shadow: 0 0 20px var(--primary);

/* Breakpoints */
@media (max-width: 768px) {
  /* Tablet */
}
@media (max-width: 480px) {
  /* Mobile */
}
```

---

**Última atualização:** Janeiro 2026
**Mantido por:** Equipe de Desenvolvimento ELO Job
