(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Scroll progress bar ---------- */
  var progress = document.getElementById("scrollProgress");
  function updateProgress() {
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var height = h.scrollHeight - h.clientHeight;
    progress.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + "%";
  }

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("header");
  function updateHeader() {
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }

  window.addEventListener("scroll", function () {
    updateProgress();
    updateHeader();
  }, { passive: true });
  updateProgress();
  updateHeader();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll(".nav__link").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  function setActiveLink() {
    var scrollPos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.getAttribute("data-delay") || 0;
        setTimeout(function () {
          entry.target.classList.add("is-visible");
        }, parseInt(delay, 10));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ---------- Animated stat counters ---------- */
  var statEls = document.querySelectorAll(".stat__num");
  var countedOnce = new WeakSet();
  var statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !countedOnce.has(entry.target)) {
        countedOnce.add(entry.target);
        animateCount(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(function (el) { statObserver.observe(el); });

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progressRatio = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progressRatio, 3);
      var value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progressRatio < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Marquee content ---------- */
  var marqueeItems = [
    "🍌 Fruit & Veg", "🥘 Afro Caribbean Foods", "🥩 Fresh & Frozen Meats", "🐟 Seafoods",
    "🌍 Nigeria · Ghana · Zimbabwe · South Africa", "📍 46 Orchard Street, Weston-super-Mare"
  ];
  var track = document.getElementById("marqueeTrack");
  if (track) {
    var html = "";
    for (var r = 0; r < 2; r++) {
      marqueeItems.forEach(function (item) {
        html += "<span>" + item + "</span>";
      });
    }
    track.innerHTML = html;
  }

  /* ---------- Floating spice particles ---------- */
  var particlesEl = document.getElementById("spiceParticles");
  if (particlesEl) {
    var colors = ["#f4b400", "#c81c26", "#ffcc33", "#b3121b"];
    var count = window.innerWidth < 700 ? 10 : 20;
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      var size = 4 + Math.random() * 8;
      span.style.width = size + "px";
      span.style.height = size + "px";
      span.style.left = Math.random() * 100 + "%";
      span.style.background = colors[Math.floor(Math.random() * colors.length)];
      span.style.animationDuration = (14 + Math.random() * 16) + "s";
      span.style.animationDelay = (Math.random() * 20) + "s";
      particlesEl.appendChild(span);
    }
  }

  /* ---------- Smooth anchor scroll offset for fixed header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = document.getElementById("header").offsetHeight;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
