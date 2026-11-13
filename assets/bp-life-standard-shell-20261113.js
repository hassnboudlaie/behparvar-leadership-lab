/* Behparvar | Learning architecture shell, inspired by Life Organization navigation.
 * UI-only: uses existing hash router and links; no learner-data, grade or question changes.
 */
(()=>{"use strict";
const ready=fn=>document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fn,{once:true}):fn();
ready(()=>{
 const app=document.getElementById("app");
 const home=document.getElementById("welcome");
 document.body.classList.add("bp-app-premium");
 if(app && home){
   document.body.dataset.bpPage="main";
   const masthead=app.querySelector(".masthead");
   if(masthead && !document.getElementById("bpStudioNav")){
     const nav=document.createElement("nav");
     nav.id="bpStudioNav";nav.className="bp-studio-nav";
     nav.setAttribute("aria-label","ناوبری اصلی به‌پرور");
     const items=[
       ["welcome","خانه","home"],
       ["competencies","شایستگی‌ها","compass"],
       ["course","جلسات","book"],
       ["scenarios","تمرین‌ها","users"],
       ["progress","مسیر من","chart"]
     ];
     const drawings={
       home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
       compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.8 6-5.2 2 2-5.2z"/>',
       book:'<path d="M3 4h7a4 4 0 0 1 4 4v13H7a4 4 0 0 0-4 0z"/><path d="M21 4h-3a4 4 0 0 0-4 4v13h4a4 4 0 0 1 3 0z"/>',
       users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5v1"/>',
       chart:'<path d="M4 20V9m6 11V4m6 16v-7m5 7H2"/>'
     };
     nav.innerHTML=items.map(([route,label,icon])=>
       '<a class="bp-studio-link" href="#'+route+'" data-bp-nav="'+route+'" aria-label="'+label+'">'+
       '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+drawings[icon]+'</svg>'+
       '<span>'+label+'</span></a>'
     ).join("");
     masthead.insertAdjacentElement("afterend",nav);
     // This layer is loaded after the existing click bindings. Hash navigation
     // deliberately invokes the existing router without introducing a second one.
   }
   const fakeMark=home.querySelector(".bp-welcome-logo-mark");
   const corporateLogo=app.querySelector(".masthead .brand img");
   if(fakeMark&&corporateLogo&&!fakeMark.querySelector("img")){
     const img=document.createElement("img");
     img.src=corporateLogo.getAttribute("src");
     img.alt="";img.decoding="async";
     fakeMark.replaceChildren(img);
   }
   const install=home.querySelector(".bp-install-panel");
   const grid=home.querySelector(".bp-welcome-grid");
   if(install&&grid&&!home.querySelector("#bpInstallDisclosure")){
     const details=document.createElement("details");
     details.id="bpInstallDisclosure";details.className="bp-install-disclosure";
     const summary=document.createElement("summary");
     summary.textContent="نصب اپلیکیشن";
     details.append(summary,install);
     grid.insertAdjacentElement("afterend",details);
   }
   let scheduled=false;
   function sync(){
     scheduled=false;
     const active=app.querySelector(".view.active");
     if(!active)return;
     const id=active.id;
     const category=id==="welcome"?"welcome":id==="competencies"||id.startsWith("bp-c-")?"competencies":
       id==="scenarios"||id==="bp-c-clinic-2"?"scenarios":
       id==="progress"?"progress":"course";
     document.querySelectorAll("#bpStudioNav [data-bp-nav]").forEach(link=>{
       const selected=link.dataset.bpNav===category;
       link.classList.toggle("is-active",selected);
       if(selected)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current");
     });
     let crumbs=document.getElementById("bpViewTrail");
     const main=app.querySelector("#main");
     if(!crumbs&&main){
       crumbs=document.createElement("div");
       crumbs.id="bpViewTrail";crumbs.className="bp-view-trail";
       crumbs.setAttribute("aria-label","موقعیت فعلی");
       main.insertAdjacentElement("afterbegin",crumbs);
     }
     if(crumbs){
       const title=active.getAttribute("aria-label")||active.querySelector("h1,h2")?.textContent||"";
       const clean=title.replace(/\s+/g," ").trim();
       crumbs.hidden=id==="welcome";
       if(!crumbs.hidden){
         crumbs.replaceChildren();
         const back=document.createElement("a");back.href="#welcome";back.textContent="خانه";
         const marker=document.createElement("span");marker.textContent="‹";marker.setAttribute("aria-hidden","true");
         const current=document.createElement("strong");current.textContent=clean.length>65?clean.slice(0,64)+"…":clean;
         crumbs.append(back,marker,current);
       }
     }
     document.body.classList.toggle("bp-at-entry",id==="welcome");
   }
   function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(sync)}}
   const watcher=new MutationObserver(schedule);
   app.querySelectorAll(".view").forEach(view=>watcher.observe(view,{attributes:true,attributeFilter:["class"]}));
   addEventListener("hashchange",schedule);
   sync();
 }else{
   // Standalone workshop pages: preserve their own internal navigation.
   const map={"session3-self-assessment.html":"s3","session3-teamship.html":"teamship",
   "session3-teamship-assessment.html":"assessment","session4-communication-journey.html":"s4"};
   const filename=location.pathname.split("/").pop();
   const page=map[filename];
   if(!page)return;
   document.body.dataset.bpPage=page;
   if(page==="s4")return; // Existing sticky wizard and timer must remain unobstructed.
   if(document.getElementById("bpCrossNav"))return;
   const nav=document.createElement("nav");
   nav.id="bpCrossNav";nav.className="bp-cross-nav";
   nav.setAttribute("aria-label","دسترسی به بخش‌های اصلی به‌پرور");
   nav.innerHTML=
     '<a href="index.html#welcome" aria-label="خانه به‌پرور"><span aria-hidden="true">⌂</span>خانه</a>'+
     '<a href="index.html#course" aria-label="فهرست جلسات"><span aria-hidden="true">▦</span>جلسات</a>'+
     '<a href="index.html#competencies" aria-label="مدل شایستگی‌ها"><span aria-hidden="true">◈</span>شایستگی‌ها</a>';
   document.body.append(nav);
 }
});
})();
