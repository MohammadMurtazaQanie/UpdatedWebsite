const analyticsId = "G-T2KYLQ0RBK";
const cookieBanner = document.querySelector(".cookie-banner");
const acceptCookies = document.querySelector(".cookie-accept");
const declineCookies = document.querySelector(".cookie-decline");
const consentKey = "yahyaqanie.analyticsConsent";
const themeKey = "yahyaqanie.homeTheme";
const currentYear = document.querySelector("[data-current-year]");
const applySiteTheme = (theme) => {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("site-dark-pending", isDark);
  document.body.classList.toggle("site-dark", isDark);
  document.body.classList.toggle("home-dark", isDark && document.body.classList.contains("home-page"));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#111113" : "#1c1c1f");
};

applySiteTheme(localStorage.getItem(themeKey) === "dark" ? "dark" : "light");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const loadAnalytics = () => {
  if (window.gtagLoaded) {
    return;
  }
  window.gtagLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", analyticsId);
};

if (cookieBanner && acceptCookies && declineCookies) {
  const setCookieChoice = (choice) => {
    localStorage.setItem(consentKey, choice);
    cookieBanner.hidden = true;
  };
  const savedCookieChoice = localStorage.getItem(consentKey);
  if (savedCookieChoice === "accepted") {
    loadAnalytics();
  } else if (!savedCookieChoice) {
    cookieBanner.hidden = false;
  }
  acceptCookies.addEventListener("click", () => {
    setCookieChoice("accepted");
    loadAnalytics();
  });
  declineCookies.addEventListener("click", () => {
    setCookieChoice("declined");
  });
}

const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const initiativesLink = document.querySelector(".nav-initiatives");
const initiativesMenu = document.querySelector(".initiatives-menu-desktop");
const initiativesGroup = document.querySelector(".nav-group");
let lastFocusedElement;
let initiativesCloseTimer;
const focusableSelector = "a[href], button:not([disabled])";
const isCompactNav = () => window.matchMedia("(max-width: 768px)").matches;
const isCivicComingSoonLink = (link) => {
  const href = link.getAttribute("href") || "";
  return href === "#civic-technology" || href.endsWith("#civic-technology");
};

if (nav && menuToggle && initiativesLink && initiativesMenu && initiativesGroup) {
  const placeInitiativesMenu = () => {
    if (isCompactNav()) {
      return;
    }
    const rect = initiativesLink.getBoundingClientRect();
    const menuWidth = initiativesMenu.offsetWidth || 300;
    const viewportPadding = 24;
    const minLeft = viewportPadding + menuWidth / 2;
    const maxLeft = window.innerWidth - viewportPadding - menuWidth / 2;
    const targetLeft = Math.min(Math.max(rect.left + rect.width / 2, minLeft), maxLeft);
    const targetTop = rect.bottom + 18;
    initiativesMenu.style.left = `${targetLeft}px`;
    initiativesMenu.style.top = `${targetTop}px`;
  };

  const openInitiativesMenu = () => {
    if (isCompactNav()) {
      return;
    }
    clearTimeout(initiativesCloseTimer);
    placeInitiativesMenu();
    nav.classList.add("is-initiatives-open");
    requestAnimationFrame(placeInitiativesMenu);
  };

  const scheduleInitiativesClose = () => {
    if (isCompactNav()) {
      return;
    }
    initiativesCloseTimer = setTimeout(() => {
      if (!initiativesGroup.matches(":hover") && !initiativesMenu.matches(":hover")) {
        nav.classList.remove("is-initiatives-open");
      }
    }, 240);
  };

  const syncNav = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
    menuToggle.classList.toggle("is-scrolled", window.scrollY > 24);
    themeToggle?.classList.toggle("is-scrolled", window.scrollY > 24);
    if (nav.classList.contains("is-initiatives-open")) {
      placeInitiativesMenu();
    }
  };

  const closeMobileMenu = () => {
    nav.classList.remove("is-open", "is-initiatives-open");
    initiativesGroup.classList.remove("is-mobile-submenu-open");
    menuToggle.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  const openMobileMenu = () => {
    lastFocusedElement = document.activeElement;
    nav.classList.add("is-open");
    menuToggle.classList.add("is-open");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    const firstFocusable = nav.querySelector(focusableSelector);
    if (firstFocusable) {
      firstFocusable.focus();
    }
  };

  syncNav();
  window.addEventListener("scroll", syncNav, { passive: true });
  window.addEventListener("resize", placeInitiativesMenu);

  menuToggle.addEventListener("click", () => {
    const isOpen = !nav.classList.contains("is-open");
    if (isOpen) {
      openMobileMenu();
      return;
    }
    closeMobileMenu();
  });

  initiativesLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (isCompactNav()) {
      initiativesGroup.classList.toggle("is-mobile-submenu-open");
      return;
    }
    openInitiativesMenu();
  });

  initiativesGroup.addEventListener("pointerenter", openInitiativesMenu);
  initiativesGroup.addEventListener("pointerleave", scheduleInitiativesClose);
  initiativesMenu.addEventListener("pointerenter", openInitiativesMenu);
  initiativesMenu.addEventListener("pointerleave", scheduleInitiativesClose);

  document.addEventListener("click", (event) => {
    if (isCompactNav()) {
      return;
    }
    if (!event.target.closest(".nav-group") && !event.target.closest(".initiatives-menu-desktop")) {
      clearTimeout(initiativesCloseTimer);
      nav.classList.remove("is-initiatives-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      clearTimeout(initiativesCloseTimer);
      nav.classList.remove("is-initiatives-open");
      initiativesGroup.classList.remove("is-mobile-submenu-open");
      if (nav.classList.contains("is-open")) {
        closeMobileMenu();
      }
    }
    if (event.key === "Tab" && nav.classList.contains("is-open")) {
      const focusable = [menuToggle, ...nav.querySelectorAll(focusableSelector)].filter((element) => element.offsetParent !== null || element === menuToggle);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  document.querySelectorAll(".initiatives-menu a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (isCivicComingSoonLink(link)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    });
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (isCivicComingSoonLink(link)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (window.matchMedia("(max-width: 768px)").matches && !link.classList.contains("nav-initiatives")) {
        closeMobileMenu();
      }
    });
  });
}

const renderEmailCanvas = (canvas) => {
  const ctx = canvas.getContext("2d");
  const codes = [121, 97, 104, 121, 97, 64, 121, 97, 104, 121, 97, 113, 97, 110, 105, 101, 46, 99, 111, 109];
  const address = String.fromCharCode(...codes);
  const ratio = window.devicePixelRatio || 1;
  const width = Number(canvas.dataset.displayWidth || canvas.getAttribute("width"));
  const height = Number(canvas.dataset.displayHeight || canvas.getAttribute("height"));
  canvas.dataset.displayWidth = String(width);
  canvas.dataset.displayHeight = String(height);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.scale(ratio, ratio);
  const isHomeFooterEmail = canvas.closest(".home-footer");
  const isConnectEmail = canvas.classList.contains("connect-email");
  ctx.fillStyle = document.body.classList.contains("site-dark") ? "rgba(231, 228, 222, 0.72)" : "#171719";
  ctx.font = `${isHomeFooterEmail ? 400 : isConnectEmail ? 800 : 900} 14px Avenir, "Avenir Next", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(address, width / 2, height / 2);
};

document.querySelectorAll(".email-guard").forEach((canvas) => {
  renderEmailCanvas(canvas);
});

if (themeToggle && document.body.classList.contains("home-page")) {
  const setHomeTheme = (theme) => {
    const isDark = theme === "dark";
    applySiteTheme(theme);
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    document.querySelectorAll(".email-guard").forEach((canvas) => renderEmailCanvas(canvas));
  };

  setHomeTheme(localStorage.getItem(themeKey) === "dark" ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("site-dark") ? "light" : "dark";
    localStorage.setItem(themeKey, nextTheme);
    setHomeTheme(nextTheme);
  });
}

const writingsPage = document.querySelector(".writings-page");
if (writingsPage) {
  const searchInput = document.querySelector(".writings-search input");
  const filtersPanel = document.querySelector(".writings-filters");
  const filtersToggle = document.querySelector(".writings-filter-toggle");
  const filterSelects = [...document.querySelectorAll(".writings-filters select")];
  const resetButton = document.querySelector(".writings-reset");
  const writingCards = [...document.querySelectorAll(".writing-card")];
  const compactFilters = window.matchMedia("(max-width: 900px)");
  const markLongWritingTitles = () => {
    writingCards.forEach((card) => {
      const title = card.querySelector("h2");
      if (!title) {
        return;
      }
      const lineHeight = parseFloat(getComputedStyle(title).lineHeight) || title.offsetHeight;
      card.classList.toggle("has-long-title", title.scrollHeight > lineHeight * 1.45);
    });
  };
  const closeCustomSelects = () => {
    document.querySelectorAll(".custom-select.is-open").forEach((openSelect) => {
      openSelect.classList.remove("is-open");
      openSelect.closest("label")?.classList.remove("is-custom-open");
      openSelect.querySelector(".custom-select-button")?.setAttribute("aria-expanded", "false");
    });
  };
  const customSelects = filterSelects.map((select) => {
    const label = select.closest("label");
    const customSelect = document.createElement("div");
    const button = document.createElement("button");
    const buttonText = document.createElement("span");
    const menu = document.createElement("div");

    label?.classList.add("has-custom-select");
    select.classList.add("is-enhanced");
    select.setAttribute("aria-hidden", "true");
    select.tabIndex = -1;

    customSelect.className = "custom-select";
    button.className = "custom-select-button";
    button.type = "button";
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    menu.className = "custom-select-menu";
    menu.setAttribute("role", "listbox");

    const getButtonText = () => {
      const mobileLabel = label?.dataset.mobileLabel || "";
      if (compactFilters.matches && select.selectedIndex === 0 && mobileLabel) {
        return mobileLabel;
      }
      return select.options[select.selectedIndex]?.text || "";
    };

    buttonText.textContent = getButtonText();
    button.append(buttonText);

    [...select.options].forEach((option, index) => {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.textContent = option.text;
      optionButton.setAttribute("role", "option");
      optionButton.setAttribute("aria-selected", String(index === select.selectedIndex));
      optionButton.addEventListener("click", () => {
        select.selectedIndex = index;
        buttonText.textContent = getButtonText();
        menu.querySelectorAll("button").forEach((item, itemIndex) => {
          item.setAttribute("aria-selected", String(itemIndex === index));
        });
        customSelect.classList.remove("is-open");
        label?.classList.remove("is-custom-open");
        button.setAttribute("aria-expanded", "false");
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      menu.append(optionButton);
    });

    button.addEventListener("click", () => {
      const willOpen = !customSelect.classList.contains("is-open");
      closeCustomSelects();
      customSelect.classList.toggle("is-open", willOpen);
      label?.classList.toggle("is-custom-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });

    customSelect.append(button, menu);
    select.insertAdjacentElement("afterend", customSelect);
    return { select, buttonText, customSelect, menu, getButtonText };
  });

  const syncCustomSelectLabels = () => {
    customSelects.forEach(({ buttonText, getButtonText }) => {
      buttonText.textContent = getButtonText();
    });
  };

  filtersToggle?.addEventListener("click", () => {
    const isOpen = !filtersPanel?.classList.contains("is-mobile-expanded");
    filtersPanel?.classList.toggle("is-mobile-expanded", isOpen);
    filtersToggle.setAttribute("aria-expanded", String(isOpen));
    if (!isOpen) {
      closeCustomSelects();
    }
  });

  compactFilters.addEventListener("change", () => {
    syncCustomSelectLabels();
    if (!compactFilters.matches) {
      filtersPanel?.classList.remove("is-mobile-expanded");
      filtersToggle?.setAttribute("aria-expanded", "false");
      closeCustomSelects();
    }
  });

  const normalize = (value) => value.trim().toLowerCase();
  const selectedOptionText = (select) => {
    if (!select?.selectedIndex) {
      return "";
    }
    return normalize(select.options[select.selectedIndex]?.text || "");
  };

  const filterWritings = () => {
    const query = normalize(searchInput?.value || "");
    const [issueSelect, categorySelect, languageSelect, organizeSelect] = filterSelects;
    const selectedIssue = selectedOptionText(issueSelect);
    const selectedCategory = selectedOptionText(categorySelect);
    const selectedLanguage = selectedOptionText(languageSelect);
    const selectedOrder = selectedOptionText(organizeSelect);

    if (selectedOrder === "newest" || selectedOrder === "oldest") {
      const sortedCards = [...writingCards].sort((firstCard, secondCard) => {
        const firstDate = Date.parse(firstCard.dataset.date || "");
        const secondDate = Date.parse(secondCard.dataset.date || "");
        if (Number.isNaN(firstDate) && Number.isNaN(secondDate)) {
          return 0;
        }
        if (Number.isNaN(firstDate)) {
          return 1;
        }
        if (Number.isNaN(secondDate)) {
          return -1;
        }
        return selectedOrder === "newest" ? secondDate - firstDate : firstDate - secondDate;
      });
      const list = writingCards[0]?.parentElement;
      sortedCards.forEach((card) => list?.append(card));
    }

    writingCards.forEach((card) => {
      const text = normalize(card.textContent || "");
      const issue = normalize(card.dataset.issue || "");
      const issueTags = issue.split("|").map((item) => item.trim()).filter(Boolean);
      const category = normalize(card.dataset.category || "");
      const language = normalize(card.dataset.language || "");
      const isMatch =
        (!query || text.includes(query)) &&
        (!selectedIssue || !issue || issueTags.includes(selectedIssue)) &&
        (!selectedCategory || !category || category === selectedCategory) &&
        (!selectedLanguage || !language || language === selectedLanguage);

      card.classList.toggle("is-filter-hidden", !isMatch);
      card.setAttribute("aria-hidden", String(!isMatch));
    });
  };

  filterWritings();
  searchInput?.addEventListener("input", filterWritings);
  filterSelects.forEach((select) => select.addEventListener("change", filterWritings));
  markLongWritingTitles();
  window.addEventListener("resize", markLongWritingTitles, { passive: true });
  resetButton?.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
    }
    filterSelects.forEach((select, index) => {
      select.selectedIndex = index === 3 ? 1 : 0;
    });
    customSelects.forEach(({ select, menu }) => {
      menu.querySelectorAll("button").forEach((item, itemIndex) => {
        const defaultIndex = select === filterSelects[3] ? 1 : 0;
        item.setAttribute("aria-selected", String(itemIndex === defaultIndex));
      });
    });
    syncCustomSelectLabels();
    filterWritings();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".custom-select")) {
      return;
    }
    closeCustomSelects();
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealSelectors = [
  ".home-content > *",
  ".home-portrait-panel",
  ".home-featured",
  ".home-card",
  ".home-cards-row",
  ".home-footer",
  ".profile-hero",
  ".profile-section",
  ".profile-section > *",
  ".profile-media-grid > *",
  ".profile-recognition-list > *",
  ".una-hero",
  ".una-section",
  ".una-section > *",
  ".kabulmun-section",
  ".kabulmun-section > *",
  ".nycp-section",
  ".nycp-section > *",
  ".yps-section",
  ".yps-section > *",
  ".article-hero",
  ".article-body > *",
  ".writings-controls",
  ".writing-card",
  ".connect-hero",
  ".connect-card",
  ".connect-section > *"
];

const revealCandidates = new Set();
revealSelectors.forEach((selector) => {
  document.querySelectorAll(selector).forEach((element) => revealCandidates.add(element));
});

const sectionStaggerParents = [
  ".home-cards-row",
  ".profile-media-grid",
  ".profile-recognition-list",
  ".home-logo-strip",
  ".connect-section"
];

sectionStaggerParents.forEach((selector) => {
  document.querySelectorAll(selector).forEach((parent) => {
    [...parent.children].forEach((child, index) => {
      if (index > 0 && index <= 5) {
        child.dataset.revealDelay = String(index);
      }
    });
  });
});

revealCandidates.forEach((element) => {
  element.classList.add("reveal");
});

if (prefersReducedMotion) {
  revealCandidates.forEach((element) => element.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealCandidates.forEach((element) => revealObserver.observe(element));
} else {
  revealCandidates.forEach((element) => element.classList.add("is-visible"));
}

if (!prefersReducedMotion) {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(() => { window.location.href = href; }, 380);
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      document.body.classList.remove("is-leaving");
    }
  });
}
