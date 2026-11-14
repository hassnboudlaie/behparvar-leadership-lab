/* Behparvar Leadership Lab — unified learning navigation (Impeccable).
 * Presentation-only enhancement. No mutation of assessment, timers, scores,
 * learner progress, stored answers or existing router URLs.
 */
(() => {
  "use strict";
  // The existing navigation shell is a deferred script. Run after its
  // DOMContentLoaded setup so the standalone bottom navigation exists.
  const ready = fn => {
    const afterShell = () => requestAnimationFrame(fn);
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", afterShell, { once: true });
    else afterShell();
  };

  ready(() => {
    const filename = location.pathname.split("/").pop() || "index.html";
    const pages = {
      "session3-self-assessment.html": [
        ["جلسات", "index.html#course"],
        ["جلسه سوم · توسعه فردی", null]
      ],
      "session3-teamship.html": [
        ["جلسات", "index.html#course"],
        ["جلسه سوم", "session3-self-assessment.html"],
        ["پرونده تیم‌شیپ", null]
      ],
      "session3-teamship-assessment.html": [
        ["جلسات", "index.html#course"],
        ["جلسه سوم", "session3-self-assessment.html"],
        ["تیم‌شیپ", "session3-teamship.html"],
        ["خودارزیابی تیم‌شیپ", null]
      ],
      "session4-communication-journey.html": []
    };

    // Main application already ships a five-section bottom navigation.
    // Make its dynamically created breadcrumb a proper navigation landmark.
    if (document.getElementById("app")) {
      const main = document.getElementById("main");
      if (!main) return;
      const mark = () => {
        const trail = document.getElementById("bpViewTrail");
        if (trail) trail.setAttribute("role", "navigation");
      };
      mark();
      new MutationObserver(mark).observe(main, { childList: true });
      window.addEventListener("hashchange", mark);
      return;
    }
    if (!(filename in pages)) return;

    const isJourney = filename === "session4-communication-journey.html";
    const main = isJourney ? document.getElementById("root") : document.querySelector("main");
    if (!main) return;
    const anchorId = main.id || "bpLearningMain";
    if (!main.id) main.id = anchorId;
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    if (isJourney) main.setAttribute("aria-label", "محتوای سفر ارتباطات");

    // Keep the skip control invisible except while keyboard-focused.
    if (!document.querySelector(".bp-learning-skip")) {
      const skip = document.createElement("a");
      skip.className = "bp-learning-skip";
      skip.href = "#" + anchorId;
      skip.textContent = "رفتن به محتوای اصلی";
      document.body.prepend(skip);
    }

    // Session 4 already has a bespoke wizard header and timer. No extra
    // visible navigation is added to that dense mobile interface.
    if (isJourney) return;

    const chain = pages[filename];
    const trail = document.createElement("nav");
    trail.className = "bp-learning-trail";
    trail.setAttribute("aria-label", "موقعیت در مسیر یادگیری");

    chain.forEach(([label, href], i) => {
      if (i) {
        const sep = document.createElement("span");
        sep.className = "bp-learning-separator";
        sep.textContent = "‹";
        sep.setAttribute("aria-hidden", "true");
        trail.append(sep);
      }
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        trail.append(link);
      } else {
        const current = document.createElement("strong");
        current.textContent = label;
        current.setAttribute("aria-current", "page");
        trail.append(current);
      }
    });
    main.insertAdjacentElement("afterbegin", trail);

    // Match the existing application's authored stroke icons on the
    // standalone bottom navigation. Keep the original URL/label semantics.
    const drawings = {
      home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
      book: '<path d="M3 4h7a4 4 0 0 1 4 4v13H7a4 4 0 0 0-4 0z"/><path d="M21 4h-3a4 4 0 0 0-4 4v13h4a4 4 0 0 1 3 0z"/>',
      compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.8 6-5.2 2 2-5.2z"/>'
    };
    const cross = document.getElementById("bpCrossNav");
    if (cross) {
      [...cross.querySelectorAll("a")].forEach((link, i) => {
        const icon = ["home", "book", "compass"][i];
        const oldIcon = link.querySelector('span[aria-hidden="true"]');
        if (!icon || !oldIcon) return;
        oldIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
          drawings[icon] + '</svg>';
      });
    }
  });
})();
