/* Session 3 presentation controller. All self-assessment state, scoring and autosave
 * remain in bp-s3-self-assessment-20261103.js. This script only changes display. */
(function(){
"use strict";
function ready(){
 const app=document.getElementById("selfApp");
 const assessment=document.getElementById("assessment");
 const welcome=app?.querySelector(".bp-self-intro");
 const start=app?.querySelector(".bp-self-start");
 if(!app||!assessment||!welcome||!start)return;
 const body=document.body;
 function enter(smooth){
  body.classList.add("bp-s3-in-progress");
  try{if(location.hash!=="#assessment")history.replaceState(history.state,"",location.pathname+location.search+"#assessment");}catch(e){}
  assessment.scrollIntoView({behavior:smooth?"smooth":"auto",block:"start"});
 }
 function back(){
  body.classList.remove("bp-s3-in-progress");
  try{if(location.hash==="#assessment")history.replaceState(history.state,"",location.pathname+location.search);}catch(e){}
  window.scrollTo({top:0,behavior:"smooth"});
 }
 const backButton=document.getElementById("selfBackToWelcome");
 if(backButton)backButton.addEventListener("click",back);
 start.addEventListener("click",e=>{e.preventDefault();enter(true)});
 const isDeepLink=location.hash==="#assessment"||location.hash==="#results";
 if(isDeepLink)body.classList.add("bp-s3-in-progress");
 // JS failure must never hide the content: activate enhanced display only last.
 body.classList.add("bp-s3-enhanced");
 if(isDeepLink&&location.hash==="#assessment")requestAnimationFrame(()=>assessment.scrollIntoView({behavior:"auto",block:"start"}));
 const counter=document.getElementById("selfCounter")?.textContent||"";
 if(counter&&!/^\s*[۰0]\s+از/.test(counter)&&!counter.includes("—")){
  start.textContent="ادامه ارزیابی و پاسخ‌های ذخیره‌شده ←";
 }
 // If the learner uses an action in the assessment, keep that section visible.
 assessment.addEventListener("click",()=>body.classList.add("bp-s3-in-progress"));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready);
else ready();
})();
