<template>
  <!-- Hero Section -->
  <section class="hero" id="home">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 ref="heroGlitchEl" class="hero-glitch">
        CONQUISTE SEU<br />
        <span class="text-gradient">ELO MERECIDO</span>
      </h1>
      <p class="hero-subtitle">Boosters qualificados // Personalização // Resultado Garantido</p>
      <div class="hero-buttons">
        <button class="btn-3d btn-primary-3d" onclick="scrollTo('#packages')">CONTRATAR</button>
        <button class="btn-3d btn-secondary-3d" onclick="scrollTo('#services')">SABER MAIS</button>
      </div>
    </div>
  </section>

  <!-- Stats Bar -->
  <div class="stats-bar">
    <div class="stat-card">
      <div class="stat-number">15K+</div>
      <div class="stat-label">Clientes Atendidos</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">90%</div>
      <div class="stat-label">Taxa de Vitória</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">24 / 7</div>
      <div class="stat-label">Suporte Online</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">100%</div>
      <div class="stat-label">Segurança</div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 8rem 3rem 4rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://i.pinimg.com/1200x/eb/43/ba/eb43ba009fea1bc6955fd4888bf9b487.jpg');
  background-size: cover;
  background-position: center;
  filter: brightness(0.3);
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(76, 186, 157, 0.1) 0%,
    transparent 40%,
    rgba(0, 255, 245, 0.1) 100%
  );
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.hero-glitch {
  font-family: 'Orbitron', sans-serif;
  font-size: 6rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 5px;
  position: relative;
  animation: textGlitch 5s infinite;
}

@keyframes textGlitch {
  0%,
  90%,
  100% {
    text-shadow:
      0 0 20px var(--primary),
      0 0 40px var(--primary),
      2px 2px 0 var(--secondary),
      -2px -2px 0 var(--accent);
  }
  45% {
    text-shadow:
      0 0 30px var(--secondary),
      5px 0 0 var(--primary),
      -5px 0 0 var(--accent);
  }
  48% {
    text-shadow:
      0 0 20px var(--accent),
      -5px 0 0 var(--secondary),
      5px 0 0 var(--primary);
  }
}

.text-gradient {
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--primary));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.hero-subtitle {
  font-size: 1.8rem;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 2px;
}

.hero-buttons {
  display: flex;
  gap: 2rem;
}

.btn-3d {
  position: relative;
  padding: 1.5rem 3rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: none;
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%23ff8c00" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%23ffb347"/></svg>')
      12 12,
    auto;
  transition: all 0.3s;
  clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
}

.btn-primary-3d {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: var(--dark);
  box-shadow:
    0 10px 30px rgba(76, 186, 157, 0.4),
    inset 0 -5px 20px rgba(0, 0, 0, 0.3);
}

.btn-primary-3d:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 50px rgba(76, 186, 157, 0.6),
    inset 0 -5px 20px rgba(0, 0, 0, 0.3);
}

.btn-secondary-3d {
  background: transparent;
  color: var(--primary);
  border: 3px solid var(--primary);
  box-shadow:
    0 0 30px rgba(76, 186, 157, 0.3),
    inset 0 0 30px rgba(76, 186, 157, 0.1);
}

.btn-secondary-3d:hover {
  background: rgba(76, 186, 157, 0.1);
  transform: translateY(-5px);
  box-shadow:
    0 0 50px rgba(76, 186, 157, 0.5),
    inset 0 0 30px rgba(76, 186, 157, 0.2);
}

/* Stats Bar */
.stats-bar {
  position: relative;
  z-index: 3;
  max-width: 1600px;
  margin: -3rem auto 0;
  padding: 0 3rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.stat-card {
  background: rgba(10, 14, 26, 0.9);
  border: 2px solid var(--primary);
  padding: 2rem;
  text-align: center;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.5),
    inset 0 0 30px rgba(76, 186, 157, 0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow:
    0 20px 60px rgba(76, 186, 157, 0.3),
    inset 0 0 40px rgba(76, 186, 157, 0.2);
}

.stat-number {
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: var(--primary);
  text-shadow: 0 0 20px var(--primary);
}

.stat-label {
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-glitch {
    font-size: 4rem;
  }

  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-glitch {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .stats-bar {
    grid-template-columns: 1fr;
    margin-top: 2rem;
  }
}
</style>
