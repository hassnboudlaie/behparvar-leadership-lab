/* My Management Lab canonical root SW — public educational files only. */
const CACHE="mml-root-20261031-v1";
const CORE=["./","./index.html","./manifest.webmanifest","./assets/my-management-lab.css","./assets/my-management-lab.js","./assets/vazirmatn.woff2","./app/icon.svg"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>Promise.all(CORE.map(url=>cache.add(url).catch(()=>null)))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("mml-root-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});}
      return response;
    }).catch(async()=>await caches.match(event.request)||await caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>{
    if(cached)return cached;
    return fetch(event.request).then(response=>{
      if(response.ok&&url.pathname.includes("/behparvar-leadership-lab/")){
        const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      }
      return response;
    });
  }));
});