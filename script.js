(function () {
  "use strict";

  var header      = document.querySelector("[data-header]");
  var menu        = document.querySelector("[data-menu]");
  var menuButton  = document.querySelector("[data-menu-button]");
  var processTabs = document.querySelectorAll("[data-process-tab]");
  var processPanels = document.querySelectorAll("[data-process-panel]");
  var contactForm = document.querySelector("[data-contact-form]");

  // ── Fullpage state ──────────────────────────────────────────────────────
  var sections       = Array.from(document.querySelectorAll("main > section"));
  var currentIndex   = 0;
  var isTransitioning = false;
  var touchStartY    = 0;
  var EXIT_MS        = 260;
  var STAGGER_MS     = 45;

  // Fullpage só no desktop e sem preferência por movimento reduzido.
  // No mobile e no modo reduzido, o scroll é nativo e todo conteúdo fica visível.
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile       = window.matchMedia("(max-width: 880px)").matches;
  var useFullpage    = !prefersReduced && !isMobile;

  function getRevealEls(section) {
    return Array.from(section.querySelectorAll(".reveal, .reveal-left, .reveal-right"));
  }

  function enterSection(section, goingBack) {
    if (goingBack) section.classList.add("section-enter--back");
    section.classList.add("is-active");

    var els = getRevealEls(section);
    els.forEach(function (el, i) {
      setTimeout(function () {
        section.classList.remove("section-enter--back");
        el.classList.add("is-visible");
      }, 50 + Math.min(i, 6) * STAGGER_MS);
    });

    syncHeader();
  }

  function exitSection(section, goingBack, callback) {
    var exitClass = goingBack ? "section-exit section-exit--back" : "section-exit";
    exitClass.split(" ").forEach(function (c) { section.classList.add(c); });

    setTimeout(function () {
      section.classList.remove("section-exit", "section-exit--back", "is-active");
      getRevealEls(section).forEach(function (el) {
        el.classList.remove("is-visible");
      });
      callback();
    }, EXIT_MS);
  }

  function goTo(nextIndex) {
    if (isTransitioning) return;
    if (nextIndex === currentIndex) return;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    isTransitioning = true;
    var goingBack  = nextIndex < currentIndex;
    var prevIndex  = currentIndex;
    currentIndex   = nextIndex;

    setHeaderHidden(!goingBack && nextIndex > 0);

    exitSection(sections[prevIndex], goingBack, function () {
      var target = sections[nextIndex];
      document.body.scrollTop = target.offsetTop;
      document.documentElement.scrollTop = target.offsetTop;

      enterSection(target, goingBack);

      setTimeout(function () {
        isTransitioning = false;
      }, EXIT_MS + getRevealEls(target).length * STAGGER_MS + 300);
    });
  }

  function goNext() { goTo(currentIndex + 1); }
  function goPrev() { goTo(currentIndex - 1); }

  // Com zoom alto a seção pode ser maior que a tela: antes de trocar de
  // seção, o scroll nativo corre até o fim do conteúdo dela.
  function overflowBelow() {
    var doc = document.scrollingElement || document.documentElement;
    var sec = sections[currentIndex];
    return (sec.offsetTop + sec.offsetHeight) - (doc.scrollTop + window.innerHeight) > 4;
  }

  function overflowAbove() {
    var doc = document.scrollingElement || document.documentElement;
    return doc.scrollTop - sections[currentIndex].offsetTop > 4;
  }

  // ── Header ───────────────────────────────────────────────────────────────
  function syncHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", currentIndex > 0);
  }

  // Some ao rolar para baixo, reaparece ao rolar para cima
  function setHeaderHidden(hidden) {
    if (!header) return;
    if (hidden && document.body.classList.contains("menu-open")) hidden = false;
    header.classList.toggle("is-hidden", hidden);
  }

  // ── Menu ─────────────────────────────────────────────────────────────────
  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (!menu || !menuButton) return;
    var isOpen = menu.classList.toggle("is-open");
    menuButton.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.classList.toggle("menu-open", isOpen);
    if (isOpen) setHeaderHidden(false);
  }

  // ── Process tabs ─────────────────────────────────────────────────────────
  function setProcessTab(index) {
    processTabs.forEach(function (tab) {
      var active = tab.getAttribute("data-process-tab") === String(index);
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.setAttribute("tabindex", active ? "0" : "-1");
    });
    processPanels.forEach(function (panel) {
      panel.classList.toggle(
        "is-active",
        panel.getAttribute("data-process-panel") === String(index)
      );
    });
  }

  function handleTabKeydown(e) {
    var keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
    if (keys.indexOf(e.key) === -1) return;
    e.preventDefault();
    e.stopPropagation();

    var current = Number(e.currentTarget.getAttribute("data-process-tab"));
    var delta = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
    var next = (current + delta + processTabs.length) % processTabs.length;

    setProcessTab(next);
    processTabs[next].focus();
  }

  // ── Contact form ─────────────────────────────────────────────────────────
  function handleContactSubmit(event) {
    event.preventDefault();
    var data    = new FormData(contactForm);
    var name    = String(data.get("name")    || "").trim();
    var area    = String(data.get("area")    || "").trim();
    var message = String(data.get("message") || "").trim();
    var text = [
      "Olá, Cecília. Gostaria de agendar uma consulta.",
      "",
      "Nome: " + name,
      "Área de interesse: " + area,
      "Resumo: " + message
    ].join("\n");
    window.open(
      "https://wa.me/5562983002101?text=" + encodeURIComponent(text),
      "_blank",
      "noopener,noreferrer"
    );
  }

  // ── Wheel ─────────────────────────────────────────────────────────────────
  var wheelAccum   = 0;
  var wheelTimer   = null;

  function handleWheel(e) {
    if (isTransitioning) { e.preventDefault(); return; }

    // Libera o scroll nativo enquanto a própria seção tiver conteúdo fora
    // da tela (zoom alto) e na última seção (para alcançar o rodapé).
    var atLast = currentIndex === sections.length - 1;
    if (e.deltaY > 0 && (overflowBelow() || atLast)) return;
    if (e.deltaY < 0 && overflowAbove()) return;

    e.preventDefault();

    wheelAccum += e.deltaY;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { wheelAccum = 0; }, 250);

    if (wheelAccum > 60)  { wheelAccum = 0; goNext(); }
    if (wheelAccum < -60) { wheelAccum = 0; goPrev(); }
  }

  // ── Touch ─────────────────────────────────────────────────────────────────
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (isTransitioning) return;
    var delta = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 50) {
      if (delta > 0 && overflowBelow()) return;
      if (delta < 0 && overflowAbove()) return;
      delta > 0 ? goNext() : goPrev();
    }
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────
  function handleKeydown(e) {
    if (e.target.matches("input, textarea, select")) {
      if (e.key === "Escape") closeMenu();
      return;
    }
    if (e.key === "Escape") { closeMenu(); return; }
    if (!useFullpage) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (overflowBelow()) return;
      e.preventDefault(); goNext();
    }
    if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (overflowAbove()) return;
      e.preventDefault(); goPrev();
    }
    if (e.key === "Home") { e.preventDefault(); goTo(0); }
    if (e.key === "End")  { e.preventDefault(); goTo(sections.length - 1); }
  }

  // ── Anchor clicks ─────────────────────────────────────────────────────────
  function handleAnchorClick(e) {
    var href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    if (!useFullpage) { closeMenu(); return; }

    var targetEl = document.querySelector(href);
    if (!targetEl) return;

    var idx = sections.indexOf(targetEl);
    if (idx === -1 && targetEl === document.querySelector("main")) idx = 0;
    if (idx === -1) return;

    e.preventDefault();
    closeMenu();
    goTo(idx);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    if (useFullpage) {
      enterSection(sections[0], false);
      window.addEventListener("wheel",      handleWheel,      { passive: false });
      window.addEventListener("touchstart", handleTouchStart, { passive: true  });
      window.addEventListener("touchend",   handleTouchEnd,   { passive: true  });
    } else {
      // Scroll nativo: tudo visível, header acompanha o scroll
      document.body.classList.add("native-scroll");
      sections.forEach(function (s) { s.classList.add("is-active"); });
      document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(function (el) {
        el.classList.add("is-visible");
      });
      var lastScrollY = 0;
      window.addEventListener("scroll", function () {
        if (!header) return;
        var doc = document.scrollingElement || document.documentElement;
        var y = doc.scrollTop;
        header.classList.toggle("is-scrolled", y > 40);
        setHeaderHidden(y > lastScrollY && y > 120);
        lastScrollY = y;
      }, { passive: true });
    }

    document.addEventListener("keydown",  handleKeydown);

    document.querySelectorAll("a[href^='#']").forEach(function (link) {
      link.addEventListener("click", handleAnchorClick);
    });

    if (menuButton) {
      menuButton.addEventListener("click", toggleMenu);
    }

    if (menu) {
      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });
    }

    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) closeMenu();
    }, { passive: true });

    processTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        setProcessTab(tab.getAttribute("data-process-tab"));
      });
      tab.addEventListener("keydown", handleTabKeydown);
    });

    if (contactForm) {
      contactForm.addEventListener("submit", handleContactSubmit);
    }
  }

  init();
}());
