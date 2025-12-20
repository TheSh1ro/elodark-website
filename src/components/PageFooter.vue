<template>
  <footer>
    <div class="footer-content">
      <div class="footer-logo">ELODARK</div>
      <p class="footer-subtitle">A plataforma de boost mais confiável do Brasil</p>
      <div class="social-links">
        <a href="#">＠</a>
        <a href="#">◆</a>
        <a href="#">▶</a>
        <a href="#">✉</a>
      </div>
      <p class="footer-copyright">© 2026 ELODARK. Todos os direitos reservados.</p>
      <p class="footer-notice">Não afiliado ou endossado pela Riot Games</p>
    </div>
  </footer>
</template>
<script lang="ts"></script>
<style scoped>
footer {
  background: rgba(5, 8, 16, 0.95);
  padding: 4rem 3rem 2rem;
  border-top: 2px solid var(--primary);
  position: relative;
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  text-align: center;
}

.footer-logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
}

.social-links a {
  width: 60px;
  height: 60px;
  background: rgba(76, 186, 157, 0.1);
  border: 2px solid var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary);
  transition: all 0.3s;
  text-decoration: none;
}

.social-links a:hover {
  background: var(--primary);
  color: var(--dark);
  transform: translateY(-10px) scale(1.2);
  box-shadow: 0 15px 40px rgba(76, 186, 157, 0.5);
}

/* Footer text styles */
.footer-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin: 1rem 0;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  margin-top: 2rem;
}

.footer-notice {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
