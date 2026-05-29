(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var menu = document.querySelector("[data-menu]");
  var menuButton = document.querySelector("[data-menu-button]");
  var processTabs = document.querySelectorAll("[data-process-tab]");
  var processPanels = document.querySelectorAll("[data-process-panel]");
  var contactForm = document.querySelector("[data-contact-form]");
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  var heroBgImg = document.querySelector(".hero-bg-img");

  function syncHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 36);
  }

  function syncParallax() {
    if (!heroBgImg) return;
    var scrolled = window.scrollY;
    if (scrolled < window.innerHeight * 1.4) {
      heroBgImg.style.transform = "translateY(" + (scrolled * 0.25) + "px) scale(1.08)";
    }
  }

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
  }

  function setProcessTab(index) {
    processTabs.forEach(function (tab) {
      var active = tab.getAttribute("data-process-tab") === String(index);
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });

    processPanels.forEach(function (panel) {
      panel.classList.toggle("is-active", panel.getAttribute("data-process-panel") === String(index));
    });
  }

  function initReveal() {
    if (!revealEls.length) return;

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  function handleContactSubmit(event) {
    event.preventDefault();

    var data = new FormData(contactForm);
    var name = String(data.get("name") || "").trim();
    var area = String(data.get("area") || "").trim();
    var message = String(data.get("message") || "").trim();

    var text = [
      "Olá, Cecília. Gostaria de agendar uma consulta.",
      "",
      "Nome: " + name,
      "Área de interesse: " + area,
      "Resumo: " + message
    ].join("\n");

    window.open("https://wa.me/5562983002101?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
  }

  window.addEventListener("scroll", syncHeader, { passive: true });
  window.addEventListener("scroll", syncParallax, { passive: true });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 880) closeMenu();
  }, { passive: true });

  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  }

  if (menu) {
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  processTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setProcessTab(tab.getAttribute("data-process-tab"));
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }

  syncHeader();
  initReveal();
}());
