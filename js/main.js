/* ==========================================================================
   4Dev Studio — Shared behavior v2
   Nav toggle · FAQ accordion · current-year stamp
   Lenis smooth scroll (your working config)
   + Reveal-on-scroll · count-up · magnetic buttons · Spline guard
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when a link is clicked (mobile UX)
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Mark current nav link ---------- */
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    const href = a.getAttribute("href");
    if (href === path) a.setAttribute("aria-current", "page");
  });

  /* ---------- FAQ accordion ---------- */
  function bindFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      if (item.dataset.bound === "true") return;
      item.dataset.bound = "true";

      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      if (!q || !a) return;

      q.addEventListener("click", function () {
        const isOpen = item.classList.contains("is-open");

        // Close all others (single-open accordion)
        document.querySelectorAll(".faq-item.is-open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            const otherA = other.querySelector(".faq-a");
            if (otherA) otherA.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove("is-open");
          a.style.maxHeight = null;
        } else {
          item.classList.add("is-open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
  }

  bindFaq();
  window.__bindFaq = bindFaq; // exposed so services.js can re-bind dynamic FAQs

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Lenis smooth scroll ---------- */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let lenis = null;

  if (!prefersReducedMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.075,
      wheelMultiplier: 0.72,
      touchMultiplier: 0.92,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchInertiaMultiplier: 18,
      anchors: {
        offset: -76,
      },
      stopInertiaOnNavigate: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  window.__lenis = lenis;

  /* ==========================================================
     REVEAL ON SCROLL
     Auto-tags common blocks, reveals on entry, failsafe 2.5s.
     ========================================================== */

  (function revealOnScroll() {
    const autoTargets = document.querySelectorAll(
      ".section, .section-sm, .card, .step, .service-section, .cta-band, .problem-item, .hero-trust"
    );

    autoTargets.forEach(function (el) {
      if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
    });

    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }

    const failsafe = setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains("is-revealed")) {
          el.classList.add("is-revealed");
        }
      });
    }, 8000);

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.01 }
    );

    items.forEach(function (el) { io.observe(el); });

    window.addEventListener("services:rendered", function () {
      const newItems = document.querySelectorAll("[data-reveal]:not(.is-revealed)");
      newItems.forEach(function (el) { io.observe(el); });
    });

    window.addEventListener("load", function () {
      setTimeout(function () { clearTimeout(failsafe); }, 10000);
    });
  })();

  /* ==========================================================
     NUMBER COUNT-UP
     Usage: <span data-count="142" data-suffix="%">0%</span>
     ========================================================== */

  (function countUp() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      nums.forEach(function (el) {
        el.textContent =
          el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
      });
      return;
    }

    function animate(el) {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 2200;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        const value = target * eased;

        el.textContent =
          (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) +
          suffix;

        if (p < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    nums.forEach(function (el) {
      el.textContent = "0" + (el.getAttribute("data-suffix") || "");
      io.observe(el);
    });
  })();

  /* ==========================================================
     MAGNETIC BUTTONS
     Desktop only, subtle. Respects reduced-motion.
     ========================================================== */

  (function magneticButtons() {
    if (prefersReducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.innerWidth < 900) return;

    const strength = 0.28;
    const maxPull = 6;

    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;

        let x = relX * strength;
        let y = relY * strength;

        x = Math.max(-maxPull, Math.min(maxPull, x));
        y = Math.max(-maxPull, Math.min(maxPull, y));

        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });

      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  })();

  /* ==========================================================
     SPLINE — tag visibility (lets you style/pause off-screen)
     ========================================================== */

  (function splineGuard() {
    const viewers = document.querySelectorAll("spline-viewer");
    if (!viewers.length) return;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.05 }
    );

    viewers.forEach(function (el) { io.observe(el); });
  })();

})();