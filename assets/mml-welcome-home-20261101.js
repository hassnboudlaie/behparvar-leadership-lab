/* Behparvar Welcome navigation and light-weight progress view.
   No changes to the existing 42 learning routes or stored answer formats. */
(function(){
"use strict";
var PARTS=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
var SESSIONS=["رهبری","مدل شایستگی","معطوف به خود","معطوف به دیگران","نتایج کسب‌وکار","مدیریت پیشرفته"];
var EMOJI=["🧭","🗓️","📊","💬","🤝","🚀"];
function portal(){
  var map=document.getElementById("bp-competency-map");
  var target=document.getElementById("bp-competency-portal");
  var hub=document.querySelector("#course .mml-hub");
  var sessions=hub&&hub.querySelector(".mml-session-area");
  if(!map||!target||!sessions)return;
  var inModel=document.getElementById("competencies").classList.contains("active");
  if(inModel&&map.parentNode!==target){target.appendChild(map)}
  else if(!inModel&&map.parentNode!==hub){hub.insertBefore(map,sessions)}
}
function progress(){
 var root=document.getElementById("bp-progress-content");
 if(!root)return;
 var record={};
 try{record=JSON.parse(localStorage.getItem("behparvar_app_v1")||"{}")||{}}catch(e){}
 var audience=new URLSearchParams(location.search).get("audience")||record.role||"managers";
 audience=audience==="supervisors"?"supervisors":"managers";
 var done=Array.isArray(record.done)?record.done:[];
 var count=0;var groups=[];
 for(var session=1;session<=6;session++){
   var valid=new Set(done.filter(function(k){
     return typeof k==="string"&&k.indexOf(audience+":"+session+":")===0;
   }).map(function(k){return k.split(":")[2]}));
   var n=PARTS.filter(function(key){return valid.has(key)}).length;
   count+=n;groups.push(n);
 }
 var percent=Math.round(count/42*100);
 root.replaceChildren();
 var card=document.createElement("div");card.className="bp-progress-summary";
 var circle=document.createElement("div");circle.className="bp-progress-ring";
 circle.style.setProperty("--pct",percent+"%");
 var center=document.createElement("span");center.textContent=percent.toLocaleString("fa-IR")+"٪";
 circle.appendChild(center);
 var body=document.createElement("div");
 var strong=document.createElement("strong");strong.textContent=count.toLocaleString("fa-IR")+" از ۴۲ بخش مرورشده";
 var intro=document.createElement("p");
 intro.textContent="مسیر "+(audience==="supervisors"?"سرپرستان":"مدیران")+" · مرور دستی در همین مرورگر. معیار سنجش شایستگی نیست.";
 body.append(strong,intro);
 card.append(circle,body);root.append(card);
 var list=document.createElement("div");list.className="bp-progress-rows";
 groups.forEach(function(number,i){
  var node=document.createElement("div");node.className="bp-progress-row";
  var title=document.createElement("strong");title.textContent=EMOJI[i]+" جلسه "+(i+1).toLocaleString("fa-IR")+" · "+SESSIONS[i];
  var note=document.createElement("p");note.textContent=number.toLocaleString("fa-IR")+" از ۷ بخش مرورشده";
  var track=document.createElement("div");track.className="bp-progress-bar";
  var bar=document.createElement("i");bar.style.width=Math.round(number/7*100)+"%";
  track.append(bar);node.append(title,note,track);
  list.append(node);
 });
 root.append(list);
}
function setHeroFallback(){
 var hero=document.querySelector("#welcome .bp-welcome-photo");
 if(!hero)return;
 /* Respect the official Behparvar hero; never silently restore generic meeting artwork. */
 hero.src="assets/behparvar-campus.webp";
 hero.onerror=function(){this.onerror=null;this.src="assets/production-official.webp"};
}

function render(){
 portal();
 if(document.querySelector("#progress.active"))progress();
}
function init(){
 setHeroFallback();
 render();
 document.addEventListener("click",function(e){
   if(e.target.closest('[data-open]'))requestAnimationFrame(render);
 });
 window.addEventListener("hashchange",function(){requestAnimationFrame(render)});
 window.addEventListener("pageshow",render);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();