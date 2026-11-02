/* My Management Lab — presentation integration.
   Does not modify existing learning data, localStorage schema or routing contracts. */
(function(){
 "use strict";
 var sections=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
 var sectionNames=["شروع","گفت‌وگوی کاری","نکته مهم","راه‌حل","مقایسه دو روش","اشتباه رایج","آزمون و اقدام"];
 var sessionNames=["اول","دوم","سوم","چهارم","پنجم","ششم"];
 function modeName(partIndex,mode){
   if(partIndex===6)return mode==="main"?"آزمون و مرور":"اقدام من";
   return mode==="main"?"محتوا و تمرین":"تمرین کوتاه";
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
     var library=window.MMLLessonLibrary;
     var roleButton=document.querySelector('[data-mml-role][aria-pressed="true"]');
     var explicitRole=new URLSearchParams(location.search).get("audience");
     /* Session-two deep links must respect explicit learner route even if the
        original interactive role button has not been rendered yet. */
     var selectedRole=(n===2&&(explicitRole==="managers"||explicitRole==="supervisors"))?
       explicitRole:(roleButton?roleButton.getAttribute("data-mml-role"):"managers");
     var lessonMarkup=library&&typeof library.render==="function"?library.render(n,part,selectedRole):"";
     var lesson=null;
     if(lessonMarkup){
       lesson=document.createElement("div");
       lesson.className="mml-edu-panel";
       lesson.innerHTML=lessonMarkup;
       guided.parentNode.insertBefore(lesson,guided);
     }
     // Canonical classroom practice replaces mismatched archived session content.
     // Old exercises and their stored answers remain in DOM, readable only in instructor audit mode.
     var aligned=window.MMLAlignedUI;
     if(aligned&&typeof aligned.render==="function"){
       var oldBody=primary.querySelector(":scope > .mml-legacy-body");
       if(oldBody){
         var main=document.createElement("div");
         main.className="mml-aligned-panel";
         main.innerHTML=aligned.render(n,part,selectedRole);
         oldBody.parentNode.insertBefore(main,oldBody);
         var archive=document.createElement("details");
         archive.className="mml-instructor-archive";
         archive.hidden=!new URLSearchParams(location.search).has("instructor");
         var label=document.createElement("summary");
         label.textContent="محتوا و تمرین‌های قبلی (فقط برای بازبینی مدرس)";
         archive.appendChild(label);
         archive.appendChild(oldBody);
         primary.appendChild(archive);
       }
     }

     // Beginner-first reader: ONE visible teaching flow. Instructor retains the archived modes.
     if(!new URLSearchParams(location.search).has("instructor")){
       view.classList.add("mml-tabbed","mml-simple-view");
       var header=document.createElement("header");
       header.className="mml-reader-heading";
       header.innerHTML='<p class="mml-reader-where">جلسه '+sessionNames[n-1]+' · بخش '+(i+1).toLocaleString("fa-IR")+' از ۷</p>'+
         '<h2 tabindex="-1">'+sectionNames[i]+'</h2>';
       guided.hidden=true;
       primary.hidden=false;primary.open=true;
       if(lesson){
         if(i!==6&&!(n===2&&i===1)){
           lesson.hidden=false;
           var more=document.createElement("details");
           more.className="mml-reader-more";
           var summary=document.createElement("summary");
           summary.textContent="مطالعه بیشتر";
           more.appendChild(summary);
           more.appendChild(lesson);
           var alignedNode=primary.querySelector(".mml-aligned-panel");
           if(alignedNode)alignedNode.appendChild(more);
         }else lesson.hidden=true;
       }
       primary.parentNode.insertBefore(header,primary);
       var before=i>0?(n===1?sections[i-1]:"session"+n+"-"+sections[i-1]):"";
       var after=i<6?(n===1?sections[i+1]:"session"+n+"-"+sections[i+1]):"";
       var arrows=document.createElement("nav");
       arrows.className="mml-reader-navigation";
       arrows.setAttribute("aria-label","حرکت بین بخش‌های جلسه");
       arrows.innerHTML=(before?'<a href="#'+before+'">بخش قبل</a>':'<a href="#course">همه جلسات</a>')+
        (after?'<a class="mml-reader-next" href="#'+after+'">بخش بعدی ←</a>':'<a class="mml-reader-next" href="#course">پایان جلسه · همه جلسات</a>');
       primary.insertAdjacentElement("afterend",arrows);
       return;
     }
     var wrapper=document.createElement("div");
     wrapper.className="mml-view-switcher";
     wrapper.innerHTML='<h2 tabindex="-1">'+sectionNames[i]+'</h2>'+
       
       '<div class="mml-mode-controls" role="group" aria-label="انتخاب نوع محتوا">'+
       (lesson?'<button type="button" data-mode="lesson" aria-pressed="false">درسنامه</button>':"")+
       '<button type="button" data-mode="main" aria-pressed="false">'+modeName(i,"main")+'</button>'+
       '<button type="button" data-mode="guided" aria-pressed="false">'+modeName(i,"guided")+'</button></div>';
     guided.parentNode.insertBefore(wrapper,lesson||guided);
     view.classList.add("mml-tabbed");
     primary.open=true;
     var buttons=wrapper.querySelectorAll("[data-mode]");
     function show(which,focus){
       guided.hidden=which!=="guided";
       if(lesson)lesson.hidden=which!=="lesson";
       primary.hidden=which!=="main";
       primary.open=true;
       buttons.forEach(function(button){button.setAttribute("aria-pressed",String(button.dataset.mode===which))});
       if(focus){
         var target=which==="main"?primary:which==="lesson"&&lesson?lesson:guided;
         var heading=target.querySelector("h2,h3,[tabindex='-1']");
         if(heading){heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true})}
       }
     }
     buttons.forEach(function(button){button.addEventListener("click",function(){show(button.dataset.mode,true)})});
     // The existing, deeply authored first-session content must be primary by default.
     // In later sessions, authored lessons are the primary view; original content and guided practice remain available.
     show(i===6?"main":n===1?"main":lesson?"lesson":"guided",false);
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
   area.innerHTML='<div class="mml-session-heading"><h2>جلسات یادگیری</h2></div>';
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

 function buildSimpleSessionHomes(){
   if(new URLSearchParams(location.search).has("instructor"))return;
   var course=window.MMLAlignedData&&window.MMLAlignedData.sessions;
   if(!course||course.length!==6)return;
   var role=new URLSearchParams(location.search).get("audience");
   var chosen=role==="managers"||role==="supervisors";
   for(var n=1;n<=6;n++){
     var root=document.getElementById(n===1?"home":"session"+n);
     if(!root||root.classList.contains("mml-clean-landing"))continue;
     var landing=document.createElement("section");
     landing.className="mml-simple-session-home";
     var title=course[n-1].title,goal=course[n-1].skill;
     var start=n===1?"m1":"session"+n+"-m1";
     landing.innerHTML='<p class="mml-reader-where">جلسه '+sessionNames[n-1]+' از ۶</p>'+
       '<h1 tabindex="-1">'+title+'</h1>'+
       '<p class="mml-simple-goal"><strong>در این جلسه یاد می‌گیری:</strong> '+goal+'</p>'+
       '<div class="mml-simple-entry-actions"></div>';
     var actions=landing.querySelector(".mml-simple-entry-actions");
     if(chosen){
       actions.innerHTML='<a class="mml-reader-next" href="#'+start+'">شروع جلسه ←</a>'+
       '<a href="#course">همه جلسات</a>';
     }else{
       var existing=n===1?root.querySelector(".audience-grid"):root.querySelector(".session-role-buttons");
       var titleEl=document.createElement("h2");
       titleEl.textContent="مسیر خود را انتخاب کن";
       actions.appendChild(titleEl);
       if(existing){
         existing.classList.add("mml-simple-role-options");
         existing.querySelectorAll("button").forEach(function(b){
           b.innerHTML=b.getAttribute("data-audience-entry")==="supervisors"||b.getAttribute("data-session-audience")==="supervisors"?"سرپرستان":"مدیران";
         });
         actions.appendChild(existing);
       }
     }
     root.insertBefore(landing,root.firstChild);
     root.classList.add("mml-clean-landing");
   }
 }
 function syncEntryChrome(){
   var current=document.querySelector(".view.active");
   document.body.classList.toggle("mml-session-entry-screen",
     !!current&&current.classList.contains("mml-clean-landing"));
 }
 function restoreHeadingFocus(){
   var title=document.querySelector(".view.active .mml-reader-heading h2, .view.active .mml-simple-session-home h1, .view.active .mml-view-switcher h2");
   if(title){title.focus({preventScroll:true})}
 }
 function init(){
   if(!document.body.classList.contains("mml-refreshed"))return;
   document.body.classList.add(new URLSearchParams(location.search).has("instructor")?"mml-instructor-mode":"mml-beginner-mode");
   buildHome();
   cleanNavigation();
   buildLessonSwitchers();
   buildSimpleSessionHomes();
   syncEntryChrome();
   window.addEventListener("hashchange",function(){requestAnimationFrame(function(){syncEntryChrome();restoreHeadingFocus()})});
   document.addEventListener("click",function(event){
     if(event.target.closest("[data-open],.mml-resume"))requestAnimationFrame(function(){syncEntryChrome();restoreHeadingFocus()});
   });
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
 else init();
})();
