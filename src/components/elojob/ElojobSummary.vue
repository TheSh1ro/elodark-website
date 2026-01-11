<template>
  <div class="summary-card">
    <h3 class="summary-title">Resumo do Pedido</h3>

    <div class="summary-details">
      <div class="summary-item">
        <span class="summary-label">De:</span>
        <span class="summary-value">{{ currentElo }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Para:</span>
        <span class="summary-value">{{ targetElo }}</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-item">
        <span class="summary-label">Divisões</span>
        <span class="summary-value">{{ divisions }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Tempo Estimado</span>
        <span class="summary-value">{{ estimatedTime }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Estimativa de inicio</span>
        <span class="summary-value">24h</span>
      </div>
    </div>

    <div class="price-display">
      <div class="price-amount">
        <span class="currency">R$</span>
        <span class="price">{{ price }}</span>
      </div>
    </div>

    <button class="btn-primary">CONTRATAR AGORA</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentElo: string
  targetElo: string
  divisions: number
  estimatedTime: string
  price: number
}>()
</script>

<style scoped>
.summary-card {
  background: var(--dark);
  border: 2px solid var(--primary);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(76, 186, 157, 0.2);
}

.summary-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  text-align: center;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
}

.summary-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--secondary);
}

.summary-divider {
  height: 1px;
  background: rgba(76, 186, 157, 0.2);
  margin: 0.5rem 0;
}

.price-display {
  background: rgba(76, 186, 157, 0.05);
  border: 2px solid var(--primary);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.price-label {
  display: block;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.price-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.currency {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.3rem;
  color: var(--secondary);
  font-weight: 700;
}

.price {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 6px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 100%;
}

.btn-primary:hover {
  box-shadow: 0 0 30px var(--primary);
  transform: translateY(-2px);
}
</style>
