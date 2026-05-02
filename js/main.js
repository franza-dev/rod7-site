/* ============================================================
   RODNEY SILVA · ROD7 — main interactions
   Preloader, nav, scroll, reveal, lightbox, custom cursor, scramble
============================================================ */
(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var pl = document.getElementById("preloader");
    if (pl) {
      setTimeout(function () { pl.classList.add("is-out"); }, 700);
      setTimeout(function () { pl.style.display = "none"; }, 1700);
    }
    document.querySelector(".hero")?.classList.add("is-ready");
  });

  /* ---------- Year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    var scrolled = window.scrollY > 40;
    nav.classList.toggle("is-stuck", scrolled);

    // Detect light/dark section under nav
    var navHeight = nav.offsetHeight;
    var probeY = navHeight + 4;
    var elements = document.elementsFromPoint(window.innerWidth / 2, probeY);
    var section = elements.find(function (el) {
      return el.classList && (el.classList.contains("section--light") || el.classList.contains("section--dark") || el.classList.contains("statement") || el.classList.contains("hero"));
    });
    if (section && (section.classList.contains("section--light") || section.classList.contains("statement"))) {
      nav.classList.add("is-light");
    } else {
      nav.classList.remove("is-light");
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  var toggle = document.getElementById("navToggle");
  var drawer = document.getElementById("drawer");
  var drawerClose = document.getElementById("drawerClose");
  function openDrawer()  { drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden","false"); toggle.setAttribute("aria-expanded","true"); }
  function closeDrawer() { drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden","true"); toggle.setAttribute("aria-expanded","false"); }
  if (toggle && drawer) {
    toggle.addEventListener("click", openDrawer);
    drawerClose.addEventListener("click", closeDrawer);
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeDrawer); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = ["bio","concept","historias","mural","abstrato","taki","contato"];
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__menu a"));
  function updateActive() {
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = null;
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el.offsetTop <= pos) current = id;
    });
    navLinks.forEach(function (a) {
      var hash = a.getAttribute("href").replace("#","");
      if (hash === current) a.classList.add("is-active");
      else a.classList.remove("is-active");
    });
  }
  document.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  /* ---------- Reveal on scroll ---------- */
  document.documentElement.classList.add("js-reveal");

  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }) : null;

  var revealEls = document.querySelectorAll(".reveal");
  revealEls.forEach(function (el) {
    if (io) io.observe(el);
    else el.classList.add("is-in");
  });

  setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }, 2400);

  /* ---------- Scramble text ---------- */
  // Cycles random chars before settling on the target. Triggered by .scramble class.
  var scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ•—/";
  function scramble(el, finalText, duration) {
    duration = duration || 900;
    var queue = [];
    var oldText = el.textContent;
    var maxLen = Math.max(oldText.length, finalText.length);
    for (var i = 0; i < maxLen; i++) {
      var from = oldText[i] || "";
      var to = finalText[i] || "";
      var start = Math.floor(Math.random() * 40);
      var end = start + Math.floor(Math.random() * 40);
      queue.push({ from: from, to: to, start: start, end: end, char: "" });
    }
    var frame = 0;
    var raf;
    function step() {
      var output = "";
      var complete = 0;
      for (var i = 0; i < queue.length; i++) {
        var q = queue[i];
        if (frame >= q.end) {
          complete++;
          output += q.to;
        } else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
          output += '<span style="color:var(--rust-3);opacity:.6">' + q.char + "</span>";
        } else {
          output += q.from;
        }
      }
      el.innerHTML = output;
      if (complete === queue.length) {
        el.textContent = finalText;
        cancelAnimationFrame(raf);
        return;
      }
      frame++;
      raf = requestAnimationFrame(step);
    }
    step();
  }

  // Run scramble on hero title once preloader is done
  setTimeout(function () {
    document.querySelectorAll(".scramble").forEach(function (el) {
      var finalText = el.dataset.text || el.textContent;
      el.dataset.text = finalText;
      scramble(el, finalText, 900);
    });
  }, 800);

  // Re-scramble on hover (eyebrow lines, stat labels)
  document.querySelectorAll(".scramble-hover").forEach(function (el) {
    var finalText = el.textContent;
    el.dataset.text = finalText;
    el.addEventListener("mouseenter", function () {
      scramble(el, el.dataset.text, 600);
    });
  });

  /* ---------- Custom cursor ---------- */
  var cursor = null;
  if (window.matchMedia("(hover: hover)").matches && window.innerWidth > 760) {
    cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.innerHTML = '<span class="cursor__label">Ver</span>';
    document.body.appendChild(cursor);

    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!cursor.classList.contains("is-ready")) cursor.classList.add("is-ready");
    });
    function tick() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(tick);
    }
    tick();

    // Hover states
    document.body.addEventListener("mouseover", function (e) {
      var t = e.target;
      var zoomable = t.closest("[data-cursor='zoom']");
      var hoverable = t.closest("a, button, [data-cursor='hover']");
      if (zoomable) {
        cursor.classList.add("is-zoom");
        cursor.classList.remove("is-hover");
      } else if (hoverable) {
        cursor.classList.add("is-hover");
        cursor.classList.remove("is-zoom");
      }
    });
    document.body.addEventListener("mouseout", function (e) {
      var t = e.target;
      if (t.closest("a, button, [data-cursor]")) {
        cursor.classList.remove("is-hover", "is-zoom");
      }
    });
  }

  /* ---------- Parallax (subtle) ---------- */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  function onParallax() {
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.dataset.parallax) || 0.1;
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var offset = (window.innerHeight / 2 - center) * speed;
      el.style.transform = "translateY(" + offset.toFixed(1) + "px)";
    });
  }
  document.addEventListener("scroll", onParallax, { passive: true });
  onParallax();

  /* ---------- Lightbox ---------- */
  var lb     = document.getElementById("lightbox");
  var lbImg  = document.getElementById("lbImg");
  var lbCap  = document.getElementById("lbCap");
  var lbClose= document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");

  var groups = {};
  function registerCarouselGroup(carousel, key) {
    var items = Array.prototype.slice.call(carousel.querySelectorAll("[data-img]"));
    groups[key] = items;
    items.forEach(function (a, idx) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        openLB(key, idx);
      });
      a.setAttribute("tabindex","0");
      a.setAttribute("role","button");
    });
  }
  document.querySelectorAll(".carousel, .gallery").forEach(function (el, i) {
    registerCarouselGroup(el, "g" + i);
  });

  var current = { key: null, idx: 0 };
  function openLB(key, idx) {
    current.key = key; current.idx = idx;
    showLB();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden","false");
    document.documentElement.style.overflow = "hidden";
  }
  function closeLB() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden","true");
    document.documentElement.style.overflow = "";
  }
  function showLB() {
    var arr = groups[current.key]; if (!arr) return;
    var node = arr[current.idx];
    var src = node.getAttribute("data-img") || node.querySelector("img").src;
    var alt = node.querySelector("img")?.alt || "";
    lbImg.src = src;
    lbImg.alt = alt;
    lbCap.textContent = alt + "  ·  " + (current.idx + 1) + " / " + arr.length;
  }
  function nav_(d) {
    var arr = groups[current.key]; if (!arr) return;
    current.idx = (current.idx + d + arr.length) % arr.length;
    showLB();
  }
  if (lb) {
    lbClose.addEventListener("click", closeLB);
    lbPrev.addEventListener("click", function () { nav_(-1); });
    lbNext.addEventListener("click", function () { nav_(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowLeft") nav_(-1);
      if (e.key === "ArrowRight") nav_(1);
    });
  }
})();
