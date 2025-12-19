(() => {
  "use strict";

  /* =============================
   * CONFIGURAÇÕES GERAIS
   * ============================= */
  const CONFIG = {
    typingSpeed: 80,
    pulseDuration: 400,
    particlesCount: 70,
    observerThreshold: 0.25,
    revealDelay: 180 // atraso entre camadas
  };

  /* =============================
   * UTILIDADES
   * ============================= */
  const qs = (sel, scope = document) => scope.querySelector(sel);
  const qsa = (sel, scope = document) => [...scope.querySelectorAll(sel)];

  /* =============================
   * INICIALIZAÇÃO
   * ============================= */
  document.addEventListener("DOMContentLoaded", () => {
    initTypingEffect();
    initSmoothScroll();
    initProgressiveReveal();
    initScrollTexture();
    initButtonPulse();
    initParticles();
  });

  /* =============================
   * EFEITO DE DIGITAÇÃO
   * ============================= */
  function initTypingEffect() {
    const title = qs("h1");
    if (!title) return;

    const text = title.textContent.trim();
    title.textContent = "";
    let index = 0;

    const type = () => {
      title.textContent += text.charAt(index++);
      if (index < text.length) {
        setTimeout(type, CONFIG.typingSpeed);
      }
    };
    type();
  }

  /* =============================
   * ROLAGEM SUAVE
   * ============================= */
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(link => {
      link.addEventListener("click", e => {
        const target = qs(link.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* =============================
   * REVELAÇÃO PROGRESSIVA (CAMADAS)
   * ============================= */
  function initProgressiveReveal() {
    const sections = qsa(
      ".portfolio-item, .qualificacoes, .endereco, .reveal"
    );

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const children = [...entry.target.children];
        children.forEach((el, i) => {
          el.classList.add("hidden");
          setTimeout(() => {
            el.classList.add("show");
          }, i * CONFIG.revealDelay);
        });

        observer.unobserve(entry.target);
      });
    }, { threshold: CONFIG.observerThreshold });

    sections.forEach(sec => observer.observe(sec));
  }

  /* =============================
   * TEXTURA REAGINDO AO SCROLL
   * ============================= */
  function initScrollTexture() {
    const textured = qsa(".textured");

    window.addEventListener("scroll", () => {
      textured.forEach(el => {
        const rect = el.getBoundingClientRect();
        const progress = 1 - rect.top / window.innerHeight;

        if (progress > 0 && progress < 1) {
          el.style.opacity = progress;
          el.style.transform = `
            translateY(${20 - progress * 20}px)
            scale(${0.98 + progress * 0.02})
          `;
          el.style.filter = `blur(${4 - progress * 4}px)`;
        }
      });
    });
  }

  /* =============================
   * EFEITO PULSO NOS BOTÕES
   * ============================= */
  function initButtonPulse() {
    qsa(".header-button").forEach(button => {
      button.addEventListener("click", () => {
        button.classList.add("pulse");
        setTimeout(
          () => button.classList.remove("pulse"),
          CONFIG.pulseDuration
        );
      });
    });
  }

  /* =============================
   * PARTÍCULAS NO CANVAS (ORGÂNICAS)
   * ============================= */
  function initParticles() {
    const canvas = document.createElement("canvas");
    canvas.id = "particles";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const colors = ["#8b0000", "#ff4444", "#3b2f2f", "#b30000"];
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (
          this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height
        ) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.fill();
      }
    }

    particles = Array.from(
      { length: CONFIG.particlesCount },
      () => new Particle()
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }
})();
