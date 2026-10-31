/* Canonical My Management Lab service worker: network-first updates, offline fallback. */
const CACHE="mml-root-20261031-v4";
const CORE=["./","./index.html","./manifest.webmanifest","./assets/my-management-lab.css","./assets/mml-readability.css","./assets/my-management-lab.js","./assets/mml-guided-lessons.js","./assets/vazirmatn.woff2","./app/icon.svg"];
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