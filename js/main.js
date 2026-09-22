/* ============================================================
   CONFIGURAÇÃO CENTRAL — altere os dados comerciais aqui.
   ============================================================ */
const CONFIG = {
  PRODUCT_NAME: "50+ Maneiras de Fazer Café",
  PRICE_FROM: "R$ 99,90",
  PRICE_CURRENT: "R$ 24,99",
  CHECKOUT_URL: "https://pay.cakto.com.br/p7tieao_1118468",
  OFFER_END_DATE: "", // Ex.: "2026-12-31T23:59:59-03:00". Deixe vazio para ocultar o cronômetro.
  SUPPORT_EMAIL: "",
  SITE_URL: "https://infdlae.github.io/maisde50cafes/",
  PRIVACY_URL: "#",
  TERMS_URL: "#",
  SUPPORT_URL: "#"
};

const CAMPAIGN_PARAMS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid"];

function parseBrl(value) {
  if (!value) return NaN;
  const normalized = String(value)
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(normalized);
}

function formatBrl(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function calculateSavings() {
  const from = parseBrl(CONFIG.PRICE_FROM);
  const current = parseBrl(CONFIG.PRICE_CURRENT);
  if (!Number.isFinite(from) || !Number.isFinite(current) || from <= current) return "";
  return `Economize ${formatBrl(from - current)}`;
}

function formatCheckoutUrl(baseUrl) {
  if (!baseUrl || baseUrl === "#") return "#";
  try {
    const target = new URL(baseUrl, window.location.href);
    const current = new URL(window.location.href);
    CAMPAIGN_PARAMS.forEach((key) => {
      const value = current.searchParams.get(key);
      if (value && !target.searchParams.has(key)) target.searchParams.set(key, value);
    });
    return target.toString();
  } catch {
    return baseUrl;
  }
}

function trackEvent(eventName, payload = {}) {
  // Preparado para Meta Pixel / analytics futuro.
  // Exemplo após instalar o Pixel: if (window.fbq) fbq('track', eventName, payload);
  if (typeof window.fbq === "function") window.fbq("track", eventName, payload);
}

function applyConfig() {
  const map = {
    productName: CONFIG.PRODUCT_NAME,
    priceFrom: CONFIG.PRICE_FROM,
    priceCurrent: CONFIG.PRICE_CURRENT,
    savings: calculateSavings()
  };
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    if (map[key] != null) el.textContent = map[key];
  });

  document.querySelectorAll("[data-price-from-wrap]").forEach((el) => {
    el.hidden = !CONFIG.PRICE_FROM;
  });

  const checkout = formatCheckoutUrl(CONFIG.CHECKOUT_URL);
  document.querySelectorAll(".checkout-link").forEach((link) => {
    link.href = checkout;
    link.addEventListener("click", (event) => {
      if (CONFIG.CHECKOUT_URL === "#") {
        event.preventDefault();
        alert("Configure CHECKOUT_URL em js/main.js antes de publicar a campanha.");
        return;
      }
      trackEvent("InitiateCheckout", { cta: link.dataset.cta || "unknown", product_name: CONFIG.PRODUCT_NAME });
    });
  });

  const canonical = document.getElementById("canonicalLink");
  if (canonical && CONFIG.SITE_URL) canonical.href = CONFIG.SITE_URL;

  const legalLinks = [
    ["privacyUrl", CONFIG.PRIVACY_URL],
    ["termsUrl", CONFIG.TERMS_URL],
    ["supportUrl", CONFIG.SUPPORT_URL]
  ];
  legalLinks.forEach(([key, url]) => {
    const link = document.querySelector(`[data-config-link="${key}"]`);
    if (!link) return;
    if (!url || url === "#") {
      link.hidden = true;
      return;
    }
    link.href = url;
  });

  const contact = document.getElementById("contactLink");
  if (contact) {
    if (CONFIG.SUPPORT_EMAIL) {
      contact.href = `mailto:${CONFIG.SUPPORT_EMAIL}`;
    } else {
      contact.hidden = true;
    }
  }
}

function setupCountdown() {
  const wrap = document.getElementById("countdownWrap");
  if (!CONFIG.OFFER_END_DATE) return;
  const end = new Date(CONFIG.OFFER_END_DATE);
  if (Number.isNaN(end.getTime()) || end <= new Date()) return;

  wrap.hidden = false;
  const limited = document.getElementById("limitedTimeLabel");
  if (limited) limited.hidden = false;
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  const tick = () => {
    const diff = end.getTime() - Date.now();
    if (diff <= 0) {
      wrap.hidden = true;
      const limited = document.getElementById("limitedTimeLabel");
      if (limited) limited.hidden = true;
      clearInterval(timer);
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    hours.textContent = String(h).padStart(2, "0");
    minutes.textContent = String(m).padStart(2, "0");
    seconds.textContent = String(s).padStart(2, "0");
  };
  tick();
  const timer = setInterval(tick, 1000);
}

function setupFaq() {
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => observer.observe(el));
}

function setupScrollUi() {
  const header = document.getElementById("siteHeader");
  const back = document.getElementById("backToTop");
  const sticky = document.getElementById("stickyCta");

  // O CTA flutuante permanece disponível durante toda a navegação.
  // Ele não é ocultado quando outros CTAs entram no viewport.
  if (sticky) sticky.classList.remove("hidden");

  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
    if (back) back.classList.toggle("visible", window.scrollY > 700);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (back) {
    back.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
}

function setupTypewriter() {
  const targets = document.querySelectorAll("[data-typewriter]");
  if (!targets.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const run = (el) => {
    if (el.dataset.typed === "true") return;
    el.dataset.typed = "true";
    const text = el.dataset.typewriter || el.textContent.trim();
    if (reduceMotion) {
      el.textContent = text;
      return;
    }

    el.textContent = "";
    el.classList.add("is-typing");
    let index = 0;
    const type = () => {
      el.textContent = text.slice(0, index + 1);
      index += 1;
      if (index < text.length) {
        window.setTimeout(type, index < 5 ? 70 : 52);
      } else {
        window.setTimeout(() => el.classList.remove("is-typing"), 650);
      }
    };
    type();
  };

  if (!("IntersectionObserver" in window)) {
    targets.forEach(run);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  targets.forEach((el) => observer.observe(el));
}


function setupCoffeeCarousel() {
  const carousel = document.getElementById("coffeeCarousel");
  const prev = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");
  if (!carousel || !prev || !next) return;

  const move = (direction) => {
    const card = carousel.querySelector(".ingredient-card");
    const gap = 16;
    const amount = card ? card.getBoundingClientRect().width + gap : carousel.clientWidth * 0.82;
    carousel.scrollBy({ left: direction * amount, behavior: "smooth" });
  };
  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
  });
}

function setupMenu() {
  const toggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("menuDrawer");
  const overlay = document.getElementById("menuOverlay");
  const close = document.getElementById("menuClose");
  if (!toggle || !drawer || !overlay || !close) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    overlay.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) close.focus();
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  close.addEventListener("click", () => setOpen(false));
  overlay.addEventListener("click", () => setOpen(false));
  drawer.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

function setupHeroTilt() {
  const stage = document.querySelector(".mockup-stage");
  const visual = document.querySelector(".hero-visual");
  if (!stage || !visual) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  visual.addEventListener("mousemove", (event) => {
    const rect = visual.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.transform = `perspective(1100px) rotateY(${-9 + px * 14}deg) rotateX(${3 - py * 10}deg)`;
  });
  visual.addEventListener("mouseleave", () => {
    stage.style.transform = "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  setupCountdown();
  setupFaq();
  setupReveal();
  setupScrollUi();
  setupMenu();
  // Hero headline is rendered immediately; the typewriter effect is disabled.
  setupCoffeeCarousel();
  setupHeroTilt();
  trackEvent("PageView");
  trackEvent("ViewContent", { content_name: CONFIG.PRODUCT_NAME });
});
