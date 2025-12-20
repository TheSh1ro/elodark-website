// Smooth scroll function
function scrollTo(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Navigation button click handlers
document.addEventListener("DOMContentLoaded", () => {
  // Navigation CTA button
  const navCta = document.querySelector(".nav-cta");
  if (navCta) {
    navCta.addEventListener("click", () => {
      scrollTo("#packages");
    });
  }

  // All package buttons
  const packageButtons = document.querySelectorAll(".package-button");
  packageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Redirecionando para o checkout...");
      // Aqui você pode adicionar a lógica de redirecionamento
      // window.location.href = "/checkout";
    });
  });

  // Navigation menu links smooth scroll
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      scrollTo(targetId);
    });
  });
});
