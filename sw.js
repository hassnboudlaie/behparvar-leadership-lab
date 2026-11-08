/* Canonical My Management Lab service worker: network-first updates, offline fallback. */
const CACHE="mml-root-20261108-session3-v55";
const CORE=["./","./index.html","./manifest.webmanifest","./assets/my-management-lab.css","./assets/mml-readability.css","./assets/mml-visual-refresh-20261031.css","./assets/mml-visual-refresh-20261031.js","./assets/mml-teaching-ui-v1.css","./assets/mml-lesson-library-v1.js","./assets/mml-aligned-content-v1.js","./assets/mml-aligned-ui-v1.js","./assets/mml-aligned-ui-v1.css","./assets/mml-learning-home-v1.css","./assets/mml-learning-home-v1.js","./assets/mml-simple-navigation-20261031.css","./assets/mml-clear-reader-v2.css","./assets/mml-welcome-home-20261101.css","./assets/mml-welcome-home-20261101.js","./assets/bp-competency-path-20261101.js","./assets/bp-competency-s2-data-20261101.js","./assets/bp-competency-profiles-20261101.js","./assets/bp-competency-path-20261101.css","./assets/bp-ux-large-type-20261101.css","./assets/bp-persian-labels-20261101.js","./assets/bp-practice-data-20261101.js","./assets/bp-practice-first-20261101.js","./assets/bp-practice-first-20261101.css","./assets/bp-s2-pair-cases-20261101.js","./assets/bp-s2-group-cases-20261101.js","./assets/bp-simple-roleplays-20261102.js","./assets/bp-curriculum-alignment-20261102.js","./assets/bp-pwa-install-20261102.js","./assets/bp-upgrade-20261102.css","./assets/bp-upgrade-data-20261102.js","./assets/bp-s2-clinic-20261101.css","./assets/bp-competency-s2-data-20261101.js","./assets/bp-competency-path-20261101.js","./assets/bp-competency-path-20261101.css","./assets/mml-welcome-stickers-20261101.svg","./assets/behparvar-campus.webp","./assets/mml-experience-redesign-20261101.js","./assets/mml-alborz-inspired-theme-20261101.css","./assets/my-management-lab.js","./assets/mml-guided-lessons.js","./session3-special.html","./session3-self-assessment.html","./assets/bp-s3-self-assessment-20261103.css","./assets/bp-s3-self-assessment-20261103.js","./assets/bp-s3-premium-mobile-20261108.css","./assets/bp-s3-premium-mobile-20261108.js","./assets/vazirmatn.woff2","./app/icon.svg","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>Promise.all(CORE.map(u=>cache.add(u).catch(()=>null)))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("mml-root-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 event.respondWith(fetch(req).then(response=>{
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{}));}
   return response;
 }).catch(async()=>{
   const cached=await caches.match(req);
   if(cached)return cached;
   if(req.mode==="navigate"){const fallback=await caches.match("./index.html");if(fallback)return fallback;}
   return Response.error();
 }));
});