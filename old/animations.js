// Intersection Observer for scroll animations
const cards = document.querySelectorAll(
  ".service-card, .package-card, .testimonial-card"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
      }
    });
  },
  { threshold: 0.1 }
);

cards.forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(50px)";
  card.style.transition = "all 0.6s ease-out";
  observer.observe(card);
});

// Glitch effect on scroll
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (Math.abs(currentScroll - lastScroll) > 100) {
    const heroGlitch = document.querySelector(".hero-glitch");
    if (heroGlitch) {
      heroGlitch.style.animation = "none";
      setTimeout(() => {
        heroGlitch.style.animation = "textGlitch 3s infinite";
      }, 10);
    }
  }
  lastScroll = currentScroll;
});

// Particle trail effect on mouse move
document.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.9) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = e.clientX + "px";
    particle.style.top = e.clientY + "px";
    particle.style.width = "3px";
    particle.style.height = "3px";
    particle.style.background = "#4cba9d";
    particle.style.borderRadius = "50%";
    particle.style.boxShadow = "0 0 10px #4cba9d";
    document.body.appendChild(particle);

    setTimeout(() => {
      particle.style.opacity = "0";
      particle.style.transform = "scale(0)";
      particle.style.transition = "all 0.5s";
    }, 100);

    setTimeout(() => {
      particle.remove();
    }, 600);
  }
});

const track = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const indicatorsContainer = document.getElementById("indicators");

const cardWidth = 280 + 24; // width + gap
let currentIndex = 0;

// Calcular quantos cards cabem na tela
function getVisibleCards() {
  const containerWidth =
    document.querySelector(".carousel-wrapper").offsetWidth;
  return Math.floor(containerWidth / cardWidth);
}

// Calcular número de páginas
function getTotalPages() {
  const visibleCards = getVisibleCards();
  return Math.ceil(cards.length / visibleCards);
}

// Criar indicadores
function createIndicators() {
  indicatorsContainer.innerHTML = "";
  const totalPages = getTotalPages();

  for (let i = 0; i < totalPages; i++) {
    const indicator = document.createElement("div");
    indicator.classList.add("indicator");
    if (i === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToPage(i));
    indicatorsContainer.appendChild(indicator);
  }
}

// Atualizar posição do carrossel
function updateCarousel() {
  const offset = -currentIndex * cardWidth * getVisibleCards();
  track.style.transform = `translateX(${offset}px)`;

  // Atualizar indicadores
  document.querySelectorAll(".indicator").forEach((ind, i) => {
    ind.classList.toggle("active", i === currentIndex);
  });
}

// Ir para página específica
function goToPage(pageIndex) {
  currentIndex = pageIndex;
  updateCarousel();
}

// Botão anterior
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

// Botão próximo
nextBtn.addEventListener("click", () => {
  const totalPages = getTotalPages();
  if (currentIndex < totalPages - 1) {
    currentIndex++;
    updateCarousel();
  }
});

// Suporte para arrastar (desktop e mobile)
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

track.addEventListener("mousedown", dragStart);
track.addEventListener("touchstart", dragStart);
track.addEventListener("mouseup", dragEnd);
track.addEventListener("touchend", dragEnd);
track.addEventListener("mousemove", drag);
track.addEventListener("touchmove", drag);
track.addEventListener("mouseleave", dragEnd);

function dragStart(e) {
  isDragging = true;
  startPos = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  track.style.cursor = "grabbing";
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  const currentPosition = e.type.includes("mouse")
    ? e.pageX
    : e.touches[0].clientX;
  const diff = currentPosition - startPos;

  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      isDragging = false;
    } else if (diff < 0 && currentIndex < getTotalPages() - 1) {
      currentIndex++;
      updateCarousel();
      isDragging = false;
    }
  }
}

function dragEnd() {
  isDragging = false;
  track.style.cursor = "grab";
}

// Auto-play (opcional)
let autoplayInterval;
function startAutoplay() {
  autoplayInterval = setInterval(() => {
    const totalPages = getTotalPages();
    if (currentIndex < totalPages - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }, 5000);
}

// Pausar autoplay ao interagir
track.addEventListener("mouseenter", () => clearInterval(autoplayInterval));
track.addEventListener("mouseleave", startAutoplay);

// Inicializar
createIndicators();
startAutoplay();

// Recriar indicadores ao redimensionar
window.addEventListener("resize", () => {
  createIndicators();
  currentIndex = 0;
  updateCarousel();
});
