/* Impeccable Safar accessibility enhancement.
 * Non-invasive: only UI focus/state, never journey answers, scoring or timing.
 */
(() => {
  "use strict";
  const root = document.getElementById("root");
  const announcer = document.getElementById("sfScreenReaderStatus");
  if (!root) return;

  let intent = null;
  let scheduled = false;
  let expiry = 0;
  const visible = el => !!el && el.isConnected &&
    el.getClientRects().length > 0 &&
    getComputedStyle(el).visibility !== "hidden" &&
    !el.closest("[hidden]");

  function syncChoiceStates() {
    root.querySelectorAll(".scalebtn[data-scale]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.classList.contains("selected")));
    });
    root.querySelectorAll(".role-card[data-role]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    });
  }

  function heading() {
    const nodes = root.querySelectorAll(
      ".sf-study-hero h1, #sfWizardHead h2, .result-hero h1, #root h1, #root h2"
    );
    return [...nodes].find(visible);
  }

  function restoreFocus() {
    scheduled = false;
    syncChoiceStates();
    if (!intent || Date.now() > expiry) { intent = null; return; }
    const action = intent;
    intent = null;
    let target;
    if (action.kind === "role") {
      target = [...root.querySelectorAll(".role-card[data-role]")]
        .find(node => node.dataset.role === action.value && visible(node));
    } else if (action.kind === "scale") {
      target = [...root.querySelectorAll("[data-scale][data-val]")]
        .find(node => node.dataset.scale === action.scale &&
          node.dataset.val === action.value && visible(node));
    } else if (action.kind === "control") {
      target = [...root.querySelectorAll("button")]
        .find(node => node.id === action.id && visible(node));
    }
    if (!target) target = heading();
    if (!target) return;
    if (target.matches("h1, h2, h3")) target.setAttribute("tabindex", "-1");
    try { target.focus({ preventScroll: true }); }
    catch (_) { target.focus(); }
    if (action.kind === "heading" && announcer) {
      const stage = root.querySelector(".sf-study-progress, #sfWizardHead .phase-counter");
      announcer.textContent = (target.textContent || "").trim() +
        (stage ? "؛ " + stage.textContent.trim() : "");
    }
  }

  // Listen before legacy handlers rebuild their containers.
  document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || button.disabled || !root.contains(button)) return;
    if (button.dataset.role) {
      intent = { kind: "role", value: button.dataset.role };
    } else if (button.dataset.scale !== undefined && button.dataset.val !== undefined) {
      intent = { kind: "scale", scale: button.dataset.scale, value: button.dataset.val };
    } else if (button.matches("#start, #sfStartStudy, #next, #sfNext, #sfPrev, " +
                               "#sfRestartJourney, [data-sf-study-step], [data-sf-phase]")) {
      intent = { kind: "heading" };
    } else if (button.matches("[data-saveq], #savealloc, #saverp, #savepeer")) {
      intent = { kind: "control", id: button.id || "" };
    } else {
      intent = null;
    }
    expiry = Date.now() + 1500;
  }, true);

  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(restoreFocus);
  });
  observer.observe(root, { childList: true, subtree: true });
  syncChoiceStates();

  // Icon-only sound control on narrow screens remains fully labelled.
  const sound = document.getElementById("sound");
  if (sound) {
    const syncSound = () => {
      const label = sound.textContent.trim();
      sound.setAttribute("aria-label", label);
      sound.setAttribute("data-sound-icon", label.split(/\\s+/)[0] || "🔕");
    };
    new MutationObserver(syncSound).observe(sound, { childList: true, subtree: true });
    syncSound();
  }
})();
