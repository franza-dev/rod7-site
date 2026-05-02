/* ============================================================
   RODNEY SILVA · ROD7 — Carousels
   - Drag/swipe horizontal with inertia
   - Snap-to-slide nav buttons
   - Marquee variant (CSS-driven, just clones for loop)
============================================================ */
(function () {
  "use strict";

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function initDragCarousel(root) {
    var viewport = root.querySelector(".carousel__viewport");
    var track = root.querySelector(".carousel__track");
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var progress = root.querySelector(".carousel__progress span");
    var counter = root.querySelector("[data-carousel-counter]");
    if (!viewport || !track) return;

    var x = 0;          // current translate
    var targetX = 0;    // target translate (for inertia)
    var maxX = 0;
    var isDown = false;
    var startX = 0, startScrollX = 0;
    var lastX = 0, vx = 0, lastT = 0;
    var rafId = null;

    function recalc() {
      maxX = Math.max(0, track.scrollWidth - viewport.clientWidth);
      x = clamp(x, -maxX, 0);
      targetX = x;
      track.style.transform = "translateX(" + x + "px)";
      updateUI();
    }

    function updateUI() {
      if (progress) {
        var ratio = maxX > 0 ? -x / maxX : 0;
        progress.style.width = (Math.max(0.18, Math.min(1, viewport.clientWidth / track.scrollWidth)) * 100) + "%";
        progress.style.transform = "translateX(" + (ratio * (1 / Math.max(.18, Math.min(1, viewport.clientWidth / track.scrollWidth))) * 100 - ratio * 100) + "%)";
        // simpler: position as % of remaining track
        progress.style.transform = "translateX(" + (ratio * (100 / Math.max(.18, Math.min(1, viewport.clientWidth / track.scrollWidth)) - 100)) + "%)";
      }
      if (counter) {
        var slides = root.querySelectorAll(".carousel__slide");
        var slideW = slides[0] ? slides[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 0) : 1;
        var idx = slideW > 0 ? Math.round(-x / slideW) + 1 : 1;
        counter.textContent = String(idx).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
      }
      if (prev) prev.disabled = x >= -1;
      if (next) next.disabled = x <= -maxX + 1;
    }

    function loop() {
      var diff = targetX - x;
      if (Math.abs(diff) > 0.4 || Math.abs(vx) > 0.4) {
        if (!isDown) {
          x += diff * 0.16;
        } else {
          x = targetX;
        }
        track.style.transform = "translateX(" + x + "px)";
        updateUI();
        rafId = requestAnimationFrame(loop);
      } else {
        x = targetX;
        track.style.transform = "translateX(" + x + "px)";
        updateUI();
        rafId = null;
      }
    }
    function kick() { if (!rafId) rafId = requestAnimationFrame(loop); }

    function onPointerDown(e) {
      isDown = true;
      viewport.classList.add("is-grabbing");
      var pageX = e.touches ? e.touches[0].pageX : e.pageX;
      startX = pageX;
      startScrollX = x;
      lastX = pageX;
      lastT = performance.now();
      vx = 0;
    }
    function onPointerMove(e) {
      if (!isDown) return;
      var pageX = e.touches ? e.touches[0].pageX : e.pageX;
      var delta = pageX - startX;
      targetX = clamp(startScrollX + delta, -maxX - 60, 60);
      var t = performance.now();
      vx = (pageX - lastX) / Math.max(1, t - lastT) * 16;
      lastX = pageX; lastT = t;
      kick();
    }
    function onPointerUp() {
      if (!isDown) return;
      isDown = false;
      viewport.classList.remove("is-grabbing");
      // Inertia: project a bit further by velocity, then clamp
      targetX = clamp(targetX + vx * 14, -maxX, 0);
      kick();
    }

    viewport.addEventListener("mousedown", onPointerDown);
    viewport.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);

    // Prevent default click after drag
    viewport.addEventListener("click", function (e) {
      if (Math.abs(targetX - startScrollX) > 6 && !isDown) {
        // small drift = click
        return;
      }
      // big drag: swallow click on links
      if (Math.abs(x - startScrollX) > 8) {
        var link = e.target.closest("a");
        if (link) e.preventDefault();
      }
    }, true);

    function snapByOne(dir) {
      var slide = root.querySelector(".carousel__slide");
      var step = slide ? (slide.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 0)) : viewport.clientWidth * 0.6;
      targetX = clamp(targetX - dir * step, -maxX, 0);
      kick();
    }
    if (prev) prev.addEventListener("click", function () { snapByOne(-1); });
    if (next) next.addEventListener("click", function () { snapByOne(1); });

    // Wheel — horizontal nudge if user holds shift OR if hovering and rolling vertically slowly
    viewport.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        targetX = clamp(targetX - e.deltaX, -maxX, 0);
        kick();
      }
    }, { passive: false });

    // Recalc on resize / image load
    window.addEventListener("resize", recalc);
    track.querySelectorAll("img").forEach(function (img) {
      if (img.complete) return;
      img.addEventListener("load", recalc, { once: true });
    });
    setTimeout(recalc, 60);
    recalc();
  }

  function initMarquee(root) {
    var track = root.querySelector(".carousel__track");
    if (!track) return;
    // Duplicate children once for seamless loop
    var clones = Array.prototype.slice.call(track.children).map(function (c) { return c.cloneNode(true); });
    clones.forEach(function (c) { c.setAttribute("aria-hidden", "true"); track.appendChild(c); });

    // Marquee speed via CSS var; allow data-speed seconds
    var speed = parseFloat(root.dataset.speed) || 60;
    track.style.setProperty("--marquee-speed", speed + "s");
    root.style.setProperty("--marquee-speed", speed + "s");
  }

  document.querySelectorAll(".carousel").forEach(function (root) {
    if (root.classList.contains("carousel--marquee")) initMarquee(root);
    else initDragCarousel(root);
  });

  // Expose for tweak panel
  window.__rod7_carousels = {
    setMarqueeSpeed: function (sec) {
      document.querySelectorAll(".carousel--marquee").forEach(function (el) {
        el.style.setProperty("--marquee-speed", sec + "s");
        el.querySelector(".carousel__track").style.setProperty("--marquee-speed", sec + "s");
      });
    }
  };
})();
