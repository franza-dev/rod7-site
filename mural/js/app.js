/* ============================================================
   ROD7 · Onepage institucional — interações
   Scroll-reveal, nav ativa, carrossel de murais (drag/setas)
============================================================ */
(function () {
  "use strict";

  /* Year */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* Sticky nav state */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 40);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("navmenu");
  if (burger && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("is-open", open);
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      /* trava o scroll do fundo enquanto o drawer esta aberto */
      document.body.classList.toggle("is-locked", open);
    };
    burger.setAttribute("aria-expanded", "false");
    burger.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
    });
    /* ao girar pra paisagem/desktop o burger some — o drawer nao pode ficar preso aberto */
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 960 && menu.classList.contains("is-open")) setMenu(false);
    });
  }

  /* Active section link */
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-navlink]"));
  var sections = links.map(function (l) { return document.querySelector(l.getAttribute("href")); });
  function updateActive() {
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= pos) current = i; });
    links.forEach(function (l, i) { l.classList.toggle("is-active", i === current); });
  }
  document.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  /* Scroll reveal */
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }) : null;
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (io) io.observe(el); else el.classList.add("is-in");
  });
  setTimeout(function () { document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); }); }, 2600);

  /* Portfolio carousel — drag + arrows + wheel */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var vp = root.querySelector(".carousel__viewport");
    var track = root.querySelector(".carousel__track");
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    var bar = root.querySelector(".carousel__bar span");
    if (!vp || !track) return;
    var x = 0, tx = 0, maxX = 0, down = false, sx = 0, sScroll = 0, vx = 0, lx = 0, lt = 0, raf = null;
    function clamp(v){ return Math.min(0, Math.max(-maxX, v)); }
    function recalc(){ maxX = Math.max(0, track.scrollWidth - vp.clientWidth); x = clamp(x); tx = x; apply(); }
    function apply(){
      track.style.transform = "translateX(" + x + "px)";
      if (bar) { var ratio = maxX>0 ? -x/maxX : 0; var vis = Math.max(.15, Math.min(1, vp.clientWidth/track.scrollWidth)); bar.style.width = (vis*100)+"%"; bar.style.transform = "translateX(" + (ratio*(100/vis-100)) + "%)"; }
      if (prev) prev.disabled = x >= -1;
      if (next) next.disabled = x <= -maxX + 1;
    }
    function loop(){ var d = tx - x; if (Math.abs(d) > .5) { x += d * (down?1:.16); apply(); raf = requestAnimationFrame(loop); } else { x = tx; apply(); raf = null; } }
    function kick(){ if (!raf) raf = requestAnimationFrame(loop); }
    function pd(e){ down=true; vp.classList.add("is-grab"); var p = e.touches?e.touches[0].pageX:e.pageX; sx=p; sScroll=x; lx=p; lt=performance.now(); vx=0; }
    function pm(e){ if(!down)return; var p = e.touches?e.touches[0].pageX:e.pageX; tx = clamp(sScroll + (p-sx)); var t=performance.now(); vx=(p-lx)/Math.max(1,t-lt)*16; lx=p; lt=t; kick(); }
    function pu(){ if(!down)return; down=false; vp.classList.remove("is-grab"); tx = clamp(tx + vx*12); kick(); }
    vp.addEventListener("mousedown", pd); vp.addEventListener("touchstart", pd, {passive:true});
    window.addEventListener("mousemove", pm); window.addEventListener("touchmove", pm, {passive:true});
    window.addEventListener("mouseup", pu); window.addEventListener("touchend", pu);
    vp.addEventListener("click", function(e){ if (Math.abs(x - sScroll) > 8){ var a=e.target.closest("a"); if(a) e.preventDefault(); } }, true);
    function step(dir){ var s = root.querySelector(".carousel__slide"); var w = s ? s.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap||0) : vp.clientWidth*.7; tx = clamp(tx - dir*w); kick(); }
    if (prev) prev.addEventListener("click", function(){ step(-1); });
    if (next) next.addEventListener("click", function(){ step(1); });
    vp.addEventListener("wheel", function(e){ if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); tx = clamp(tx - e.deltaX); kick(); } }, {passive:false});
    window.addEventListener("resize", recalc);
    track.querySelectorAll("img").forEach(function(img){ if(!img.complete) img.addEventListener("load", recalc, {once:true}); });
    setTimeout(recalc, 80); recalc();
  });

  /* Lightbox */
  var lb = document.getElementById("lightbox"), lbImg = document.getElementById("lbImg"), lbCap = document.getElementById("lbCap");
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-img]"));
  var idx = 0;
  function open(i){ idx=i; show(); lb.classList.add("is-open"); document.documentElement.style.overflow="hidden"; }
  function close(){ lb.classList.remove("is-open"); document.documentElement.style.overflow=""; }
  function show(){
    var n=items[idx]; var im=n.querySelector("img");
    /* currentSrc = a variante que o <picture> ja baixou pra este device:
       abre na hora e sem trafego extra. src (jpg) cobre quem nao tem webp. */
    lbImg.src = (im && (im.currentSrc || im.src)) || n.getAttribute("data-img");
    lbImg.alt = im?im.alt:"";
    lbCap.textContent = (idx+1)+" / "+items.length;
  }
  function move(d){ idx=(idx+d+items.length)%items.length; show(); }
  items.forEach(function(n,i){ n.addEventListener("click", function(e){ e.preventDefault(); open(i); }); });
  if (lb) {
    document.getElementById("lbClose").addEventListener("click", close);
    document.getElementById("lbPrev").addEventListener("click", function(){ move(-1); });
    document.getElementById("lbNext").addEventListener("click", function(){ move(1); });
    lb.addEventListener("click", function(e){ if(e.target===lb) close(); });
    document.addEventListener("keydown", function(e){ if(!lb.classList.contains("is-open"))return; if(e.key==="Escape")close(); if(e.key==="ArrowLeft")move(-1); if(e.key==="ArrowRight")move(1); });
  }
})();
