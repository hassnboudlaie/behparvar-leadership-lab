/* Behparvar | Learning Home V1 (benchmark: concise enterprise mobile LMS).
   Adds course progress and learning guidance; no score or stored data changes. */
(function(){
"use strict";
var PARTS=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
var WORDS=["اول","دوم","سوم","چهارم","پنجم","ششم"];
var ICONS=["◈","▦","▤","◉","◇","↻"];
var KEY="behparvar_app_v1";
function readState(){try{return JSON.parse(localStorage.getItem(KEY)||"null")||{}}catch(e){return {}}}
function roleOf(st){
 var role=new URLSearchParams(location.search).get("audience")||st.role||"managers";
 return role==="supervisors"?"supervisors":"managers";
}
function progressBySession(n,role,st){
 var seen=new Set((Array.isArray(st.done)?st.done:[]).filter(function(x){return typeof x==="string"&&x.startsWith(role+":"+n+":")}).map(function(x){return x.split(":")[2]}));
 return PARTS.filter(function(p){return seen.has(p)}).length;
}
function sessionCards(){
 var grid=document.querySelector("#course .course-sessions");
 if(!grid)return;
 var st=readState(),role=roleOf(st);
 grid.querySelectorAll(".course-session[data-course-session]").forEach(function(card){
  var n=Number(card.dataset.courseSession);
  if(n<1||n>6)return;
  var count=progressBySession(n,role,st),rate=Math.round(count*100/7);
  card.classList.add("mml-course-tile");
  card.setAttribute("aria-label","جلسه "+WORDS[n-1]+"؛ "+count+" از ۷ بخش به‌صورت دستی مرور شده");
  var icon=card.querySelector(".mml-course-tile-icon");
  if(!icon){icon=document.createElement("span");icon.className="mml-course-tile-icon";icon.setAttribute("aria-hidden","true");icon.textContent=ICONS[n-1];card.insertBefore(icon,card.firstChild)}
  var prog=card.querySelector(".mml-course-progress");
  if(!prog){prog=document.createElement("div");prog.className="mml-course-progress";card.appendChild(prog)}
  prog.innerHTML='<span class="mml-course-progress-caption">'+(count?count+" از ۷ بخش مرورشده":"آماده یادگیری")+'</span><span class="mml-course-progress-track" aria-hidden="true"><i style="width:'+rate+'%"></i></span>';
 });
 var resume=document.querySelector("#course .mml-resume");
 if(resume){
   var text=resume.querySelector("small");
   if(text&& !resume.querySelector(".mml-resume-hint")){
     var hint=document.createElement("span");hint.className="mml-resume-hint";hint.textContent="بازگشت به آخرین بخش مطالعه‌شده";resume.appendChild(hint)
   }
 }
}
function guide(){
 var course=document.getElementById("course"),hub=course&&course.querySelector(".mml-hub");
 if(!hub||hub.querySelector(".mml-study-guide"))return;
 var element=document.createElement("section");
 element.className="mml-study-guide";
 element.setAttribute("aria-label","روش یادگیری در My Management Lab");
 element.innerHTML='<div class="mml-study-guide-heading"><h2>یادگیری در سه گام</h2><p>محتوا را بخوان، در موقعیت واقعی تمرین کن و نتیجه را بازتاب بده.</p></div>'+
  '<div class="mml-study-guide-grid">'+
  '<div class="mml-study-step"><span aria-hidden="true">۰۱</span><strong>یاد بگیر · Learn</strong><p>درسنامه تیتر‌بندی‌شده، مثال، جدول و مدل دیداری</p></div>'+
  '<div class="mml-study-step"><span aria-hidden="true">۰۲</span><strong>تمرین کن · Practice</strong><p>Case Study، Role Play، تصمیم و Feedback</p></div>'+
  '<div class="mml-study-step"><span aria-hidden="true">۰۳</span><strong>به‌کار ببر · Apply</strong><p>یک اقدام مشخص با مسئول، زمان و شاهد تغییر</p></div>'+
  '</div><p class="mml-study-disclaimer">پیشرفت نمایش‌داده‌شده، تعداد بخش‌های «مرور شد» است؛ نه نمره شایستگی یا تشخیص مدیریتی.</p>';
 var after=hub.querySelector(".mml-session-area");
 if(after)after.insertAdjacentElement("afterend",element);
 else hub.appendChild(element);
}
function sessionGuide(){
 for(var n=1;n<=6;n++){
  var root=document.getElementById(n===1?"home":"session"+n);
  if(!root||root.querySelector(".mml-session-learning-status"))continue;
  var header=root.querySelector(".mml-intro")||root.querySelector(".home-hero");
  if(!header)continue;
  var d=document.createElement("aside");
  d.className="mml-session-learning-status";
  d.setAttribute("aria-label","راهنمای ورود به جلسه "+WORDS[n-1]);
  d.innerHTML='<span class="mml-session-learning-mark" aria-hidden="true">◈</span>'+
    '<div><strong>جلسه '+WORDS[n-1]+' · یادگیری مبتنی بر کار واقعی</strong>'+
    '<p>از هر یک از هفت بخش شروع کنید. درسنامه، مدل دیداری و تمرین‌ها به‌طور مستقل قابل انتخاب‌اند.</p></div>';
  header.insertAdjacentElement("afterend",d);
 }
}
function refresh(){
 if(!document.body.classList.contains("mml-refreshed"))return;
 sessionCards();guide();sessionGuide();
}
function init(){
 refresh();
 document.addEventListener("click",function(e){
  var target=e.target.closest&&e.target.closest("[data-mml-complete],[data-mml-role]");
  if(target)requestAnimationFrame(sessionCards);
 });
 window.addEventListener("pageshow",sessionCards);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();