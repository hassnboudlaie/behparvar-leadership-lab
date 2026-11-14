/* Behparvar | shared PWA registration for every supported entry route.
 * Idempotent on repeat navigation; never touches learner data.
 */
(() => {
  "use strict";
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "https:" &&
      !["localhost", "127.0.0.1"].includes(location.hostname)) return;
  const activate = () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" })
      .catch(err => console.warn("Offline mode unavailable:", err));
  };
  if (document.readyState === "complete") activate();
  else addEventListener("load", activate, { once: true });
})();
