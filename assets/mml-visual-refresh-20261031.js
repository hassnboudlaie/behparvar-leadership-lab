/* My Management Lab — presentation integration.
   Does not modify existing learning data, localStorage schema or routing contracts. */
(function(){
 "use strict";
 var sections=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
 var sectionNames=["سبک رهبری من","گفت‌وگوهای کاری","درس‌های رهبران","فنون رهبری اثربخش","تصاویر مدیریتی","بیماری‌های مدیریتی","کوییز پایانی"];
 var sessionNames=["اول","دوم","سوم","چهارم","پنجم","ششم"];
 function modeName(partIndex,mode){
   if(partIndex===6)return mode==="main"?"آزمون و محتوای اصلی":"برنامه اقدام من";
   return mode==="main"?"محتوای اصلی و تمرین‌ها":"مرور سریع و تمرین هدایت‌شده";
 }
 function buildLessonSwitchers(){
   document.querySelectorAll(".mml-refreshed-view").forEach(function(view){
     if(view.classList.contains("mml-tabbed"))return;
     var guided=Array.from(view.children).find(function(el){return el.classList.contains("mml-layer")});
     var primary=Array.from(view.children).find(function(el){return el.classList.contains("mml-legacy")});
     if(!guided||!primary)return;
     var m=/^session([2-6])-(m1|m2|leaders|techniques|visuals|diseases|quiz)$/.exec(view.id);
     var n=m?Number(m[1]):1;
     var part=m?m[2]:view.id;
     var i=sections.indexOf(part);
     if(i<0)return;
     var wrapper=document.createElement("div");
     wrapper.className="mml-view-switcher";
     wrapper.innerHTML='<h2 tabindex="-1">'+sectionNames[i]+'</h2>'+
       '<p>جلسه '+sessionNames[n-1]+' · هر بخش را مستقل باز کنید؛ پاسخ‌ها و یادداشت‌های قبلی حفظ می‌شوند.</p>'+
       '<div class="mml-mode-controls" role="group" aria-label="انتخاب نوع محتوا">'+
       '<button type="button" data-mode="main" aria-pressed="false">'+modeName(i,"main")+'</button>'+
       '<button type="button" data-mode="guided" aria-pressed="false">'+modeName(i,"guided")+'</button></div>';
     guided.parentNode.insertBefore(wrapper,guided);
     view.classList.add("mml-tabbed");
     primary.open=true;
     var buttons=wrapper.querySelectorAll("[data-mode]");
     function show(which,focus){
       guided.hidden=which!=="guided";
       primary.hidden=which!=="main";
       primary.open=true;
       buttons.forEach(function(button){button.setAttribute("aria-pressed",String(button.dataset.mode===which))});
       if(focus){
         var target=which==="main"?primary:guided;
         var heading=target.querySelector("h2,h3,[tabindex='-1']");
         if(heading){heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true})}
       }
     }
     buttons.forEach(function(button){button.addEventListener("click",function(){show(button.dataset.mode,true)})});
     // The existing, deeply authored first-session content must be primary by default.
     // In later sessions the guided layer is primary, with all original content one tap away.
     show(n===1?"main":"guided",false);
   });
 }
 function cleanNavigation(){
   var links=document.querySelectorAll("#workshopNavigation > a .sidebar-link-label");
   links.forEach(function(el,i){if(i<sectionNames.length)el.textContent=sectionNames[i]});
 }
 function buildHome(){
   var course=document.getElementById("course");
   var hub=course&&course.querySelector(".mml-hub");
   var grid=course&&course.querySelector(".course-sessions");
   if(!hub||!grid||hub.querySelector(".mml-session-area"))return;
   var zone=hub.querySelector(".mml-zone-grid");
   var role=hub.querySelector(".mml-role-picker");
   var area=document.createElement("section");
   area.className="mml-session-area";
   area.setAttribute("aria-label","شش جلسه دوره");
   area.innerHTML='<div class="mml-session-heading"><h2>جلسات یادگیری</h2><p>از هر جلسه که نیاز دارید شروع کنید.</p></div>';
   area.appendChild(grid);
   if(zone)zone.parentNode.insertBefore(area,zone);
   else if(role)role.insertAdjacentElement("afterend",area);
   else hub.appendChild(area);
   var saved=null;
   try{saved=JSON.parse(localStorage.getItem("behparvar_app_v1")||"null")}catch(e){}
   var last=saved&&saved.last;
   if(last&&last.session>=1&&last.session<=6&&sections.includes(last.part)){
     var currentRole=new URLSearchParams(location.search).get("audience")||(saved&&saved.role)||last.role;
     if(!last.role||last.role===currentRole){
       var route=last.session===1?last.part:"session"+last.session+"-"+last.part;
       var a=document.createElement("a");
       a.className="mml-resume";
       a.href="#"+route;
       a.innerHTML='<span>ادامه یادگیری<br><small>جلسه '+sessionNames[last.session-1]+' · '+sectionNames[sections.indexOf(last.part)]+'</small></span><span aria-hidden="true">←</span>';
       area.parentNode.insertBefore(a,area);
     }
   }
 }
 function restoreHeadingFocus(){
   var title=document.querySelector(".view.active .mml-view-switcher h2");
   if(title){title.focus({preventScroll:true})}
 }
 function init(){
   if(!document.body.classList.contains("mml-refreshed"))return;
   buildHome();
   cleanNavigation();
   buildLessonSwitchers();
   window.addEventListener("hashchange",function(){requestAnimationFrame(restoreHeadingFocus)});
   document.addEventListener("click",function(event){
     if(event.target.closest("[data-open],.mml-resume"))requestAnimationFrame(restoreHeadingFocus);
   });
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
 else init();
})();
