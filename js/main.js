/* ============================================================
   RODNEY SILVA · ROD7 — interactions
============================================================ */
(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var pl = document.getElementById("preloader");
    if (pl) {
      setTimeout(function () { pl.classList.add("is-out"); }, 700);
      setTimeout(function () { pl.style.display = "none"; }, 1600);
    }
  });

  /* ---------- Year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");
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
  // Mark <html> so the hidden initial state only applies when JS is alive.
  document.documentElement.classList.add("js-reveal");

  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }) : null;

  // mark candidates
  var revealEls = document.querySelectorAll(
    ".section__head, .prose, .bio__copy, .bio__portrait, .cover, .taki__copy, .taki__hero, .contact"
  );
  revealEls.forEach(function (el) {
    el.classList.add("reveal");
    if (io) io.observe(el);
    else el.classList.add("is-in");
  });

  var galleries = document.querySelectorAll(".gallery");
  galleries.forEach(function (el) {
    if (io) io.observe(el);
    else el.classList.add("is-in");
  });

  // Safety net: anything still hidden after 1.5s — reveal it.
  // This guarantees nothing stays invisible if the observer
  // somehow misses a fast-scrolling user or an iframe context.
  setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
    galleries.forEach(function (el) { el.classList.add("is-in"); });
  }, 1500);

  /* ---------- Lightbox ---------- */
  var lb     = document.getElementById("lightbox");
  var lbImg  = document.getElementById("lbImg");
  var lbCap  = document.getElementById("lbCap");
  var lbClose= document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");

  var groups = {}; // group images by their parent .gallery
  document.querySelectorAll(".gallery").forEach(function (gal, i) {
    var key = "g" + i;
    var items = Array.prototype.slice.call(gal.querySelectorAll(".g"));
    groups[key] = items;
    items.forEach(function (a, idx) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        openLB(key, idx);
      });
      a.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); openLB(key, idx); }
      });
      a.setAttribute("tabindex","0");
      a.setAttribute("role","button");
    });
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
    var alt = node.querySelector("img").alt || "";
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
