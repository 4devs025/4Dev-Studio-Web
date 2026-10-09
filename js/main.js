/* ==========================================================================
   4Dev Studio — Shared behavior v2
   Nav toggle · FAQ accordion · current-year stamp
   Smooth anchors + gentle wheel momentum
   Reveal-on-scroll · count-up · magnetic buttons · Spline guard
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

      q.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");
      q.addEventListener("click", function () {
        const isOpen = item.classList.contains("is-open");

        q.setAttribute("aria-expanded", isOpen ? "false" : "true");

        // Close all others (single-open accordion)
        document.querySelectorAll(".faq-item.is-open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            const otherA = other.querySelector(".faq-a");
            if (otherA) otherA.style.maxHeight = null;
            other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
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
  window.addEventListener("services:rendered", bindFaq);

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Wheel momentum: a short, gentle coast before stopping ---------- */
  (function momentumScroll() {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || window.matchMedia("(pointer: coarse)").matches) return;

    // A smaller value brakes faster; 110ms leaves a subtle trailing movement.
    const brakingTime = 110;
    let target = window.scrollY;
    let frame = 0;
    let lastTime = 0;
    let direction = 0;

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      direction = 0;
      target = window.scrollY;
    }

    function tick(now) {
      const elapsed = Math.min(now - lastTime, 64);
      lastTime = now;
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      target = Math.max(0, Math.min(target, max));
      const remaining = target - window.scrollY;
      if (Math.abs(remaining) < 0.75) {
        window.scrollTo({ top: target, behavior: "instant" });
        stop();
        return;
      }
      window.scrollTo({
        top: window.scrollY + remaining * (1 - Math.exp(-elapsed / brakingTime)),
        behavior: "instant"
      });
      frame = requestAnimationFrame(tick);
    }

    function hasScrollableParent(element) {
      for (let el = element; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
        if (el.matches("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) return true;
        if (el.scrollHeight > el.clientHeight && /auto|scroll|overlay/.test(getComputedStyle(el).overflowY)) return true;
      }
      return false;
    }

    window.addEventListener("wheel", function (event) {
      if (motion.matches || event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.shiftKey ||
          Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY || hasScrollableParent(event.target)) {
        stop();
        return;
      }
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = event.deltaY * unit;
      const nextDirection = Math.sign(delta);
      if (!frame || nextDirection !== direction) target = window.scrollY;
      direction = nextDirection;
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      target = Math.max(0, Math.min(target + delta, max));
      event.preventDefault();
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }, { passive: false });

    // Let direct navigation and native touch/keyboard scrolling take over immediately.
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", function (event) {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape", "Tab"].includes(event.key)) stop();
    });
    window.addEventListener("hashchange", stop);
    window.addEventListener("blur", stop);
    motion.addEventListener("change", stop);
  })();

  /* ---------- Reveal each block once as it enters the viewport ---------- */
  (function revealOnScroll() {
    const selector = ".section-head, .card, .step, .service-section, .cta-band, .problem-item, .hero-trust, .about-story, .about-location, .contact-layout, .pricing-card, [data-reveal]";
    const observed = new WeakSet();
    const io = !prefersReducedMotion && "IntersectionObserver" in window
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          });
        }, { rootMargin: "0px 0px -32px 0px", threshold: 0.01 })
      : null;

    function register() {
      document.querySelectorAll(selector).forEach(function (el) {
        if (observed.has(el)) return;
        observed.add(el);
        // Avoid stacking animations inside another revealed block.
        if (el.parentElement.closest(selector)) return;
        el.setAttribute("data-reveal", "");
        if (!io || el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-revealed");
        } else {
          io.observe(el);
        }
      });
    }

    register();
    window.addEventListener("services:rendered", register);
    window.addEventListener("case-studies:rendered", register);
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

/* Optical Illusion hehez - Jez */


if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
document.querySelectorAll(".glass-magnify").forEach((element) => {
  const zoom = 1.5;
  const lensSize = 150;

  const lens = document.createElement("div");
  lens.className = "magnifier-lens";

  const content = document.createElement("div");
  content.className = "magnifier-content";

  
  const clone = element.cloneNode(true);

  clone.removeAttribute("id");
  clone.classList.remove("glass-magnify");

  // Preserve nested element colors
  const originalChildren = element.querySelectorAll("*");
  const clonedChildren = clone.querySelectorAll("*");

  originalChildren.forEach((original, index) => {
    const copied = clonedChildren[index];

    if (!copied) return;

    const style = getComputedStyle(original);

    copied.style.color = style.color;
    copied.style.fontWeight = style.fontWeight;
    copied.style.fontStyle = style.fontStyle;
    copied.style.textDecoration = style.textDecoration;
  });

  lens.setAttribute("aria-hidden", "true");
  clone.classList.remove("glass-magnify");

  content.appendChild(clone);
  lens.appendChild(content);
  document.body.appendChild(lens);

  let rect;
  let frame = 0;

  function prepareLens() {
    rect = element.getBoundingClientRect();
    const computed = getComputedStyle(element);

    // Match the original element's typography
    Object.assign(clone.style, {
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      boxSizing: "border-box",
      margin: "0",
      padding: computed.padding,
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      lineHeight: computed.lineHeight,
      letterSpacing: computed.letterSpacing,
      textAlign: computed.textAlign,
      color: computed.color,
      background: "#101322",
      border: "none",
      borderRadius: "0"
    });

  }

  function updateLens(e) {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lens.style.left = `${e.clientX}px`;
    lens.style.top = `${e.clientY}px`;

    content.style.transform = `
      translate(
        ${lensSize / 2 - x * zoom}px,
        ${lensSize / 2 - y * zoom}px
      )
      scale(${zoom})
    `;
  }

  element.addEventListener("pointerenter", (e) => {
    prepareLens();
    updateLens(e);
    lens.classList.add("active");
  });

  element.addEventListener("pointermove", (e) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => updateLens(e));
  });

  element.addEventListener("pointerleave", () => {
    lens.classList.remove("active");
  });

  window.addEventListener("resize", () => lens.classList.remove("active"));
  window.addEventListener("scroll", () => {
    lens.classList.remove("active");
  }, { passive: true });
});
}

})();
