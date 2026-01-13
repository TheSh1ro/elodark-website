<!-- src\components\elojob\ElojobHero.vue -->
<template>
  <section class="elojob-hero">
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="section-title">ELOJOB PREMIUM</h1>
        <p class="section-subtitle">Alcance seu verdadeiro potencial competitivo</p>

        <div class="hero-badges">
          <span class="badge">VPN Segura</span>
          <span class="badge badge-accent">Garantia 100%</span>
          <span class="badge">Suporte 24/7</span>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">5000+</span>
            <span class="stat-label">Clientes Satisfeitos</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">98%</span>
            <span class="stat-label">Taxa de Sucesso</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">24h</span>
            <span class="stat-label">Início Médio</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="rank-display">
          <div class="rank-icon">
            <span class="rank-text">{{ currentRank }}</span>
          </div>
          <div class="arrow-container">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path
                d="M10 30 L50 30 M40 20 L50 30 L40 40"
                stroke="var(--secondary)"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="rank-icon rank-target">
            <span class="rank-text">{{ targetRank }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentRank = ref('PRATA')
const targetRank = ref('DIAMANTE')
</script>

<style scoped>
.elojob-hero {
  padding: 8rem 3rem 6rem;
  background: linear-gradient(
    180deg,
    var(--darker) 0%,
    rgba(76, 186, 157, 0.05) 50%,
    var(--darker) 100%
  );
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-badges {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
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

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-number {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rank-display {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.rank-icon {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: var(--dark);
  border: 3px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.3);
}

.rank-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(76, 186, 157, 0.5);
}

.rank-target {
  border-color: var(--secondary);
  box-shadow: 0 0 20px rgba(0, 255, 245, 0.3);
}

.rank-target:hover {
  box-shadow: 0 0 30px rgba(0, 255, 245, 0.5);
}

.rank-text {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  font-size: 1.1rem;
  color: var(--secondary);
  text-shadow: 0 0 10px var(--secondary);
}

.arrow-container {
  animation: pulse-arrow 2s ease-in-out infinite;
}

@keyframes pulse-arrow {
  0%,
  100% {
    transform: translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateX(10px);
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .elojob-hero {
    padding: 6rem 2rem 4rem;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .rank-display {
    gap: 1.5rem;
  }

  .rank-icon {
    width: 100px;
    height: 100px;
  }

  .rank-text {
    font-size: 0.9rem;
  }

  .arrow-container svg {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .rank-display {
    flex-direction: column;
  }

  .arrow-container svg {
    transform: rotate(90deg);
  }
}
</style>
